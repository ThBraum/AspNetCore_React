import React from "react";
import Atividade from "./Atividade";

export default function AtividadeList(props) {
  return (
    <div className="mt-3">
      {props.atividades.map((response) => (
        <Atividade
          key={response.id}
          response={response}
          handleDelete={props.handleDelete}
          pegarAtividade={props.pegarAtividade}
        />
      ))}
    </div>
  );
}
