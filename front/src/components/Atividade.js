import {
  faFrown,
  faMeh,
  faPenToSquare,
  faQuestionCircle,
  faSmile,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Badge, Button, Card } from "react-bootstrap";

export default function Atividade(props) {
  function prioridadeStyle(param, icon) {
    switch (param) {
      case 1:
        return icon ? faSmile : "success";
      case 2:
        return icon ? faMeh : "warning";
      case 3:
        return icon ? faFrown : "danger";
      default:
        return icon ? faQuestionCircle : null;
    }
  }

  function prioridadeLabel(param) {
    switch (param) {
      case 1:
        return "Baixa";
      case 2:
        return "Normal";
      case 3:
        return "Alta";
      default:
        return "Selecione";
    }
  }

  return (
    <Card
      className={
        "mb-2 shadow-sm border-" + prioridadeStyle(props.response.prioridade)
      }
    >
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Card.Title>
            <Badge bg="secondary">{props.response.id}</Badge>{" "}
            <span className="border-end mx-2"></span> {props.response.titulo}
          </Card.Title>
          <h6>
            Prioridade:
            <span className="ms-1 text-black">
              <FontAwesomeIcon
                // @ts-ignore
                icon={prioridadeStyle(props.response.prioridade, true)}
                className="me-1"
              />
              {prioridadeLabel(props.response.prioridade)}
            </span>
          </h6>
        </div>
        <Card.Text>{props.response.descricao}</Card.Text>
        <div className="d-flex justify-content-end pt-2 m-0 border-top">
          <Button
            variant="outline-primary"
            className="btn-sm me-2"
            onClick={() => props.pegarAtividade(props.response)}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            Editar
          </Button>

          <Button
            variant="outline-danger"
            className="btn-sm"
            onClick={() => props.handleDelete(props.response.id)}
          >
            <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
            Excluir
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
