using System.Collections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProAtividade.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using ProAtividade.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Serilog;

namespace ProAtividade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AtividadeController : ControllerBase
    {
        private readonly IAtividadeService _atividadeService;

        public AtividadeController(IAtividadeService atividadeService)
        {
            _atividadeService = atividadeService;
        }

        [HttpGet]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Get()
        {
            try
            {
                var atividades = await _atividadeService.PegarTodasAtividadesAsync();
                if (atividades != null)
                {
                    return Ok(atividades); //StatusCodes.Status200OK
                }
                else if (atividades == null)
                {
                    return NoContent();
                }
            }
            catch (System.Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro: {e.Message}");
            }
            //return BadRequest();
            return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro fora do try");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var atividade = await _atividadeService.PegarAtividadePorIdAsync(id);
                if (atividade != null)
                {
                    return Ok(atividade);
                }
                return NotFound($"Atividade com ID {id} não encontrada");
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Atividade atividade)
        {
            try
            {
                // var novaAtividade = await _atividadeService.AdicionarAtividade(atividade);
                // Log.Information($"novaAtividade: {novaAtividade}");
                // Log.Information($"await _atividadeService.PegarAtividadePorIdAsync(novaAtividade.Id: {await _atividadeService.PegarAtividadePorIdAsync(novaAtividade.Id)}");
                // return Created($"/api/atividade/{novaAtividade.Id}", novaAtividade);
                var novaAtividade = await _atividadeService.AdicionarAtividade(atividade);
                //Log.Information($"Atividade {atividade.Titulo} adicionada com sucesso");
                Log.Information($"{await _atividadeService.PegarAtividadePorIdAsync(atividade.Id)}");
                if (await _atividadeService.PegarAtividadePorIdAsync(atividade.Id) != null)
                {
                    var location = new Uri($"{Request.Scheme}://{Request.Host.ToUriComponent()}/api/atividade/{novaAtividade.Id}");
                    return Created(location, novaAtividade);
                }
                return BadRequest($"Atividade {atividade.Titulo} já existe");
            }
            catch (System.Exception e)
            {
                return BadRequest($"Erro: {e.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Atividade model)
        {
            try
            {
                if (model.Id != id)
                    this.StatusCode(StatusCodes.Status409Conflict,
                        "Você está tentando atualizar a atividade errada");

                var atividade = await _atividadeService.AtualizarAtividade(id, model);
                if (atividade == null) return NoContent();

                return Ok(atividade);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar Atualizar Atividade com id: ${id}. Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var atividade = _atividadeService.PegarAtividadePorIdAsync(id);
                if (await atividade != null)
                {
                    await _atividadeService.ExcluirAtividade(id);
                    return Ok();
                }
                else if (await atividade == null)
                {
                    return NotFound($"Atividade com ID {id} não encontrada");
                }
                return this.StatusCode(StatusCodes.Status500InternalServerError);
            }
            catch (System.Exception e)
            {

                return BadRequest($"Erro: {e.Message}");
            }
        }
    }
}
