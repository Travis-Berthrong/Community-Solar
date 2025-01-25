using AuthService.DTOs.User;
using AuthService.Models;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(UserService _userService) : ControllerBase
    {
        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<UserController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] UserIn userIn)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = new User
            {
                FirstName = userIn.FirstName,
                LastName = userIn.LastName,
                Email = userIn.Email,
                PhoneNumber = userIn.PhoneNumber,
                Address = userIn.Address
            };
            await _userService.CreateUser(user, userIn.Password);
            return Ok();
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
