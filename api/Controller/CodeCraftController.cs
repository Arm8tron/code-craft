using api.Data;
using api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace api.Controller
{
    [ApiController]
    [Route("api")]
    public class CodeCraftController : ControllerBase
    {
        private readonly CodeCraftDbContext _db;
        private readonly IHttpContextAccessor _contextAccessor;
        public CodeCraftController(CodeCraftDbContext db, IHttpContextAccessor contextAccessor)
        {
            _db = db;
            _contextAccessor = contextAccessor;
        }

        [HttpGet]
        public ActionResult<CodeCraft> Get(string craftId)
        {
            Console.WriteLine("Getting: " + craftId);

            if (craftId == null) return NotFound();

            var requiredCraft = _db.codeCrafts.FirstOrDefault(item => item.CraftId == craftId);

            if(requiredCraft != null)
            {
                if(requiredCraft.IsPublic)
                {
                    return requiredCraft;
                } else
                {
                    var username = User.FindFirst(ClaimTypes.Name)?.Value;
                    Console.WriteLine("username: " + username);
                    Console.WriteLine("created " + requiredCraft.CreatedBy);
                    if (username != null && username == requiredCraft.CreatedBy)
                    {
                        return requiredCraft;
                    }
                    else
                    {
                        return Forbid();
                    }
                }
            }

            return NotFound();

        }

        [HttpGet("user")]
        public IActionResult GetAllUserCrafts(string username)
        {
            if (username == null) return NotFound();

            var requiredCrafts = _db.codeCrafts.Where(item => item.CreatedBy == username).ToList();

            if (requiredCrafts != null)
            {
                return Ok(requiredCrafts);
            } else { return NotFound(); }
        }

        [HttpPatch("like")]
        public IActionResult Like(string craftId)
        {
            if (craftId == null) return NotFound(new { error = "craftId is null" });

            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            var requiredCraft = _db.codeCrafts.FirstOrDefault(item => item.CraftId == craftId);

            if (requiredCraft != null)
            {
                var likedList = requiredCraft.LikedBy;
                List<string> likedByList = likedList.Split(',').ToList();

                if (!likedByList.Contains(username))
                {
                    likedByList.Add(username);
                }
                else
                {
                    likedByList.Remove(username);
                }

                string updatedString = string.Join(",", likedByList);
                if(updatedString == "") requiredCraft.LikesCount = 0;
                else requiredCraft.LikesCount = likedByList.Count - 1;

                requiredCraft.LikedBy = updatedString;
                _db.codeCrafts.Update(requiredCraft);
                _db.SaveChanges();

                return Ok(requiredCraft); 

            }
            else
            {
                return NotFound(new { error = "Craft not found" });
            }
        }

        [HttpPatch("view")]
        public IActionResult ViewIncrement(string craftId)
        {
            if (craftId == null) return NotFound(new { error = "craftId is null" });

            var requiredCraft = _db.codeCrafts.FirstOrDefault(item => item.CraftId == craftId);

            if (requiredCraft != null)
            {
                requiredCraft.ViewsCount++;
                _db.codeCrafts.Update(requiredCraft);
                _db.SaveChanges();

                return Ok();

            }
            else
            {
                return NotFound(new { error = "Craft not found" });
            }
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
                requiredCraft.IsFork = codeCraft.IsFork;
                requiredCraft.IsPublic = codeCraft.IsPublic;

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
