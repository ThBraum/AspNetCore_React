import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import AtividadeList from "./AtividadeList";

const initialState = [
  {
    id: 1,
    titulo: "Atividade 1",
    descricao: "Descrição atividade 1",
    prioridade: "1",
  },
  {
    id: 2,
    titulo: "Atividade 2",
    descricao: "Descrição atividade 2",
    prioridade: "2",
  },
];

let atividadeInicial = {
  id: 0,
  titulo: "",
  descricao: "",
  prioridade: "Selecione",
};

export default function AtividadeForm(props) {
  const [atividades, setAtividades] = useState(initialState);
  const [atividade, setAtividade] = useState(atividadeInicial);
  const [adicionarModo, setAdicionarModo] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
  const [atividadeExclusao, setAtividadeExclusao] = useState(null); // Novo estado

  useEffect(() => {
    const atividadesStorage = localStorage.getItem("atividades");
    if (atividadesStorage) {
      setAtividades(JSON.parse(atividadesStorage));
    } else {
      setAtividades(initialState);
    }
  }, []);

  function getNextId(atividades) {
    const ids = atividades.map((atividade) => atividade.id);
    const maxId = Math.max(0, ...ids);
    return maxId + 1;
  }

  function handleEdit(atividade) {
    setAtividade(atividade);
    setAdicionarModo(false);
    setShowModal(true);
  }

  function handleCancelar() {
    setAdicionarModo(true);
    setAtividade(atividadeInicial);
    setShowModal(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const titulo = event.target.titulo.value;
    const descricao = event.target.descricao.value;
    const prioridade = event.target.prioridade.value;

    if (!titulo || !descricao || prioridade === "Selecione") {
      toast.error("Preencha todos os campos corretamente!", {
        autoClose: 3000,
      });
      return;
    }

    let novaAtividade = { ...atividade };

    if (atividade.id === 0) {
      novaAtividade.id = getNextId(atividades);
      setAtividades([...atividades, novaAtividade]);
      toast.success("Atividade adicionada com sucesso!", {
        autoClose: 3000,
      });
    } else {
      const atividadesAtualizadas = atividades.map((a) =>
        a.id === atividade.id ? novaAtividade : a
      );
      setAtividades(atividadesAtualizadas);
      toast.success("Atividade atualizada com sucesso!", {
        autoClose: 3000,
      });
    }

    setAtividade(atividadeInicial);
    setShowModal(false);
    event.target.reset();
    localStorage.setItem("atividades", JSON.stringify(atividades));
  }

  function handleDelete(id) {
    setConfirmacaoExclusao(true);
    setAtividadeExclusao(id);
  }

  function confirmarExclusao() {
    const novasAtividades = atividades.filter((atividade) => {
      return atividade.id !== atividadeExclusao;
    });

    setAtividades(novasAtividades);
    toast.success("Atividade removida com sucesso!", {
      autoClose: 3000,
    });
    localStorage.setItem("atividades", JSON.stringify(novasAtividades));

    setConfirmacaoExclusao(false);
    setAtividadeExclusao(null);
  }

  function cancelarExclusao() {
    setConfirmacaoExclusao(false);
    setAtividadeExclusao(null);
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <h2>Atividades</h2>
        <Button
          variant="outline-secondary"
          size="lg"
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faSquarePlus} />
        </Button>
      </div>
      <hr />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {adicionarModo ? "Adicionar Atividade" : "Editar Atividade"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
            <Form.Group controlId="titulo" className="col-md-6">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                placeholder="Digite o título da atividade"
                value={atividade.titulo}
                onChange={(e) =>
                  setAtividade({ ...atividade, titulo: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="prioridade" className="col-md-6">
              <Form.Label>Prioridade</Form.Label>
              <Form.Select
                name="prioridade"
                value={atividade.prioridade}
                onChange={(e) =>
                  setAtividade({ ...atividade, prioridade: e.target.value })
                }
              >
                <option value="Selecione">Selecione...</option>
                <option value="1">Baixa</option>
                <option value="2">Normal</option>
                <option value="3">Alta</option>
              </Form.Select>
            </Form.Group>
            </div>
            <Form.Group controlId="descricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                rows={2}
                placeholder="Digite a descrição"
                value={atividade.descricao}
                onChange={(e) =>
                  setAtividade({ ...atividade, descricao: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div style={{ display: "flex", marginTop: "1rem" }}>
              <Button variant="secondary" onClick={handleCancelar}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {adicionarModo ? "Adicionar" : "Atualizar"}
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={confirmacaoExclusao} onHide={cancelarExclusao}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza de que deseja excluir esta atividade?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelarExclusao}>
            Não
          </Button>
          <Button variant="danger" onClick={confirmarExclusao}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
      <AtividadeList
        atividades={atividades}
        handleDelete={handleDelete}
        pegarAtividade={handleEdit}
      />
    </>
  );
}
