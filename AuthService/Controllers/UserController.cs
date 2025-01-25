using AuthService.DTOs.UserDtos;
using AuthService.Models;
using AuthService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(UserService _userService, JwtService _jwtService) : ControllerBase
    {
        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<UserController>/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserOut>> Get(string id)
        {
            var user = await _userService.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            return new UserOut(user);
        }
        // POST api/<UserController>
        [HttpPost("signup", Name = "signup")]
        public async Task<ActionResult> Post([FromBody] UserIn userIn)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = new User
            {
                UserName = userIn.Email,
                NormalizedUserName = userIn.Email.ToUpper(),
                FirstName = userIn.FirstName,
                LastName = userIn.LastName,
                Email = userIn.Email,
                NormalizedEmail = userIn.Email.ToUpper(),
                PhoneNumber = userIn.PhoneNumber,
                Address = userIn.Address
            };
            bool res = await _userService.CreateUser(user, userIn.Password);
            if (!res)
            {
                return StatusCode(500);
            }
            return StatusCode(201);
        }

        [HttpPost("login", Name = "login")]
        public async Task<ActionResult> Login([FromBody] UserLogin userLogin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = await _userService.CheckUserCredentials(userLogin.Email, userLogin.Password);
            if (userId == null)
            {
                return Unauthorized();
            }
            var token = _jwtService.GenerateUserToken(userId);
            if (token == null)
            {
                return StatusCode(500);
            }
            return Ok(token);
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
