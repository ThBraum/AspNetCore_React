using System.Collections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProAtividade.API.Models;
using ProAtividade.API.Services;
using ProAtividade.API.Repository;

namespace ProAtividade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AtividadeController : ControllerBase
    {
        private readonly AtividadeService _atividadeService;

        public AtividadeController(AtividadeService atividadeService)
        {
            _atividadeService = atividadeService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try{
                var atividades = _atividadeService.ObterTodasAtividades();
                return Ok(atividades);
            } catch (Exception ex){
                return BadRequest($"Erro: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try{
                var atividade = _atividadeService.ObterAtividadePorId(id);
                if (atividade != null){
                    return Ok(atividade);
                }
                return NotFound($"Atividade com ID {id} não encontrada");
            } catch (Exception ex){
                return BadRequest($"Erro: {ex.Message}");
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Atividade atividade)
        {
            try{
                var novaAtividade = _atividadeService.AdicionarAtividade(atividade);
                return CreatedAtAction(nameof(Get), new { id = novaAtividade.Id }, novaAtividade);
            } catch (Exception ex){
                return BadRequest($"Erro: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Atividade atividade)
        {
            try{
                atividade.Id = id;
                var atividadeAtualizada = _atividadeService.AtualizarAtividade(atividade);
                return Ok(atividadeAtualizada);
            } catch (Exception ex){
                return BadRequest($"Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try{
                var excluidoComSucesso = _atividadeService.ExcluirAtividade(id);
                if (excluidoComSucesso){
                    return NoContent();
                }
                return NotFound($"Atividade com ID {id} não encontrada");
            } catch (Exception ex){
                return BadRequest($"Erro: {ex.Message}");
            }
        }
    }
}
