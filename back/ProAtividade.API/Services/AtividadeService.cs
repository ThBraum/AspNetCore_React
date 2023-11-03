using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ProAtividade.API.Models;
using ProAtividade.API.Repository;

namespace ProAtividade.API.Services
{
    public class AtividadeService
    {
        private readonly DataContext _context;

        public AtividadeService(DataContext context)
        {
            _context = context;
        }

        public IEnumerable<Atividade> ObterTodasAtividades()
        {
            return _context.Atividades.ToList();
        }

        public Atividade ObterAtividadePorId(int id)
        {
            return _context.Atividades.FirstOrDefault(a => a.Id == id);
        }

        public Atividade AdicionarAtividade(Atividade atividade)
        {
            _context.Atividades.Add(atividade);
            _context.SaveChanges();
            return atividade;
        }

        public Atividade AtualizarAtividade(Atividade atividade)
        {
            _context.Entry(atividade).State = EntityState.Modified;
            _context.SaveChanges();
            return atividade;
        }

        public bool ExcluirAtividade(int id)
        {
            var atividade = ObterAtividadePorId(id);
            if (atividade == null)
            {
                return false;
            }

            _context.Atividades.Remove(atividade);
            _context.SaveChanges();
            return true;
        }
    }
}
