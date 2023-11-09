using System;
using System.Collections.Generic;
using System.Linq;
using ProAtividade.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using ProAtividade.Domain.Interfaces.Services;
using System.Threading.Tasks;
using ProAtividade.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ProAtividade.Domain.Services
{
    public class AtividadeService : IAtividadeService
    {
        public IAtividadeRepo _atividadeRepo;

        public AtividadeService(IAtividadeRepo atividadeRepo)
        {
            _atividadeRepo = atividadeRepo;
        }

        public async Task<Atividade> AdicionarAtividade(Atividade model)
        {
            if (await _atividadeRepo.PegaPorTituloAsync(model.Titulo) != null)
            {
                throw new Exception($"Já existe uma atividade com o título {model.Titulo}");
            }
            if (await _atividadeRepo.PegaPorIdAsync(model.Id) == null)
            {
                _atividadeRepo.Adicionar(model);
                if (await _atividadeRepo.SalvarMudancasAsync())
                {
                    return model;
                }
            }

            return null;
        }


        public async Task<bool> ConcluirAtividade(Atividade model)
        {
            if (model != null)
            {
                model.Concluir();
                _atividadeRepo.Atualizar(model);
                return await _atividadeRepo.SalvarMudancasAsync();
            }
            return false;
        }

        public async Task<Atividade> AtualizarAtividade(int id, Atividade model)
        {
            if (await _atividadeRepo.PegaPorIdAsync(id) != null)
            {
                model.Id = id;
                _atividadeRepo.Atualizar(model);
                if (await _atividadeRepo.SalvarMudancasAsync())
                    return model;
            }
            if (model.DataConclusao != null)
                throw new Exception("Não se pode alterar atividade já concluída.");


            return null;
        }

        public async Task<bool> ExcluirAtividade(int atividadeId)
        {
            var atividade = await _atividadeRepo.PegaPorIdAsync(atividadeId);
            if (atividade == null) throw new Exception("Atividade que tentou deletar não existe");

            _atividadeRepo.Deletar(atividade);
            return await _atividadeRepo.SalvarMudancasAsync();
        }

        public async Task<Atividade> PegarAtividadePorIdAsync(int atividadeId)
        {
            try
            {
                var atividade = await _atividadeRepo.PegaPorIdAsync(atividadeId);
                if (atividade == null)
                {
                    throw new Exception($"Não existe uma atividade com o id {atividadeId}");
                }
                return atividade;
            }
            catch (System.Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Atividade[]> PegarTodasAtividadesAsync()
        {
            try
            {
                return await _atividadeRepo.PegaTodasAsync();
            }
            catch (System.Exception e)
            {
                throw new Exception(e.Message);
            }
        }

    }
}
