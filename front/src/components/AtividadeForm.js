import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
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
  const [modoEdicao, setModoEdicao] = useState(false);

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
    setModoEdicao(true);
  }

  function handleCancelar() {
    setModoEdicao(false);
    setAtividade(atividadeInicial);
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
    setModoEdicao(false);
    event.target.reset();
    localStorage.setItem("atividades", JSON.stringify(atividades));
  }

  function handleDelete(id) {
    const novasAtividades = atividades.filter((atividade) => {
      return atividade.id !== id;
    });

    setAtividades(novasAtividades);
    toast.success("Atividade removida com sucesso!", {
      autoClose: 3000,
    });
    localStorage.setItem("atividades", JSON.stringify(novasAtividades));
  }

  return (
    <>
      <Form onSubmit={handleSubmit} className="container mt-3">
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
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <Button variant="primary" type="submit" className="col-md-3 me-2">
            {modoEdicao ? "Atualizar" : "Adicionar"}
          </Button>
          {modoEdicao && (
            <Button
              variant="danger"
              onClick={handleCancelar}
              className="col-md-3"
            >
              Cancelar
            </Button>
          )}
        </div>
      </Form>
      <AtividadeList
        atividades={atividades}
        handleDelete={handleDelete}
        pegarAtividade={handleEdit}
      />
    </>
  );
}
