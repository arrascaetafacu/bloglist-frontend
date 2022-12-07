const LoginForm = (props) => {
  return(
    <form onSubmit={props.handleLogin}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={props.username}
          onChange={props.handleUsernameChange}
          id="username"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={props.password}
          onChange={props.handlePasswordChange}
          id="password"
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm

