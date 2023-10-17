using api.Data;
using api.Model;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api")]
    public class CodeCraftController : ControllerBase
    {
        private readonly CodeCraftDbContext _db;
        public CodeCraftController(CodeCraftDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public ActionResult<CodeCraft> Get(string craftId)
        {
            Console.WriteLine("Getting: " + craftId);

            if (craftId == null) return NotFound();

            var requiredCraft = _db.codeCrafts.FirstOrDefault(item => item.CraftId == craftId);

            if(requiredCraft != null)
            {
                return requiredCraft;
            }

            return NotFound();

        }

        [HttpPost]
        public IResult Post(CodeCraft codeCraft)
        {
            var craftId = codeCraft.CraftId;
            var requiredCraft = _db.codeCrafts.FirstOrDefault(item => item.CraftId == craftId);
            if(requiredCraft != null && ModelState.IsValid) {
                requiredCraft.Name = codeCraft.Name;
                requiredCraft.Css = codeCraft.Css;
                requiredCraft.Html = codeCraft.Html;
                requiredCraft.Js = codeCraft.Js;
                requiredCraft.CreatedBy = codeCraft.CreatedBy;

                _db.codeCrafts.Update(requiredCraft);
                _db.SaveChanges();
                return Results.Ok(requiredCraft.CraftId);
            } else
            {
                _db.codeCrafts.Add(codeCraft);
                _db.SaveChanges();
                return Results.Created($"Created {codeCraft.CraftId}", codeCraft.Id);
            }
        }
    }
}
