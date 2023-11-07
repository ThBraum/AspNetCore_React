import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../api/atividade";
import AtividadeList from "./AtividadeList";

const initialState = [
  {
    id: 1,
    titulo: "Atividade 1",
    descricao: "Descrição atividade 1",
    prioridade: 1,
  },
  {
    id: 2,
    titulo: "Atividade 2",
    descricao: "Descrição atividade 2",
    prioridade: 2,
  },
];

const atividadeInicial = {
  id: 0,
  titulo: "",
  descricao: "",
  prioridade: 0,
};

export default function AtividadeForm(props) {
  const [atividades, setAtividades] = useState(initialState);
  const [atividade, setAtividade] = useState(atividadeInicial);
  const [adicionarModo, setAdicionarModo] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
  const [atividadeExclusao, setAtividadeExclusao] = useState(null);

  useEffect(() => {
    const getAtividades = async () => {
      const todasAtividades = await pegarAtividade();
      if (todasAtividades) setAtividades(todasAtividades);
    };
    getAtividades();
  }, []);

  const handleEdit = (atividade) => {
    setAtividade(atividade);
    setAdicionarModo(false);
    setShowModal(true);
  }

  const handleAdicionar = () => {
    setAdicionarModo(true);
    setAtividade(atividadeInicial);
    setShowModal(true);
  }

  const handleCancelar = () => {
    setAdicionarModo(true);
    setAtividade(atividadeInicial);
    setShowModal(false);
  }

  const handleDelete = (id) => {
    setConfirmacaoExclusao(true);
    setAtividadeExclusao(id);
  }

  const confirmarExclusao = () => {
    if (atividadeExclusao !== null) {
      excluirAtividade(atividadeExclusao);
      setConfirmacaoExclusao(false);
      setAtividadeExclusao(null);
    }
  }

  const cancelarExclusao = () => {
    setConfirmacaoExclusao(false);
    setAtividadeExclusao(null);
  }

  const pegarAtividade = async () => {
    try {
      const response = await api.get("/atividade");
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Erro ao listar atividades!", error);
      toast.error("Erro ao listar atividades!", {
        autoClose: 3000,
      });
    }
  };

  const adicionarAtividade = async (atividade) => {
    if (!atividade.titulo || !atividade.descricao || atividade.prioridade === 0) {
      toast.error("Preencha todos os campos corretamente!", {
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await api.post("/atividade", atividade);
      if (response.status === 201) {
        const novaAtividade = response.data;
        setAtividades([...atividades, novaAtividade]);
        setAtividade(atividadeInicial);
        setShowModal(false);
        toast.success("Atividade adicionada com sucesso!", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar atividade!", error);
      toast.error("Erro ao adicionar atividade!", {
        autoClose: 3000,
      });
    }
  };

  const editarAtividade = async (atividade) => {
    if (!atividade.titulo || !atividade.descricao || atividade.prioridade === 0) {
      toast.error("Preencha todos os campos corretamente!", {
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await api.put(`/atividade/${atividade.id}`, atividade);
      if (response.status === 200) {
        const atividadesAtualizadas = atividades.map((a) =>
          a.id === atividade.id ? atividade : a
        );
        setAtividades(atividadesAtualizadas);
        setAdicionarModo(true);
        setAtividade(atividadeInicial);
        setShowModal(false);
        toast.success("Atividade atualizada com sucesso!", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar atividade!", error);
      toast.error("Erro ao atualizar atividade!", {
        autoClose: 3000,
      });
    }
  };

  const excluirAtividade = async (atividadeId) => {
    try {
      const response = await api.delete(`/atividade/${atividadeId}`);
      if (response.status === 204) {
        const novasAtividades = atividades.filter(
          (atividade) => atividade.id !== atividadeId
        );
        setAtividades(novasAtividades);
        toast.success("Atividade removida com sucesso!", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao excluir atividade!", error);
      toast.error("Erro ao excluir a atividade!", {
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <h2>Atividades</h2>
        <Button
          variant="outline-secondary"
          size="lg"
          onClick={() => handleAdicionar()}
        >
          <FontAwesomeIcon icon={faSquarePlus} />
        </Button>
      </div>
      <hr />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (adicionarModo) {
              adicionarAtividade(atividade);
            } else {
              editarAtividade(atividade);
            }
          }}
        >
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
                    setAtividade({
                      ...atividade,
                      prioridade: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={0}>Selecione...</option>
                  <option value={1}>Baixa</option>
                  <option value={2}>Normal</option>
                  <option value={3}>Alta</option>
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
              <Button variant="primary" type="submit" className="ms-2">
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
