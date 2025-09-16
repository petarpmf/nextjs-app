import { login } from "@/app/actions/auth";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="card" style={{maxWidth:"420px", margin:"40px auto"}}>
      <h1 className="h1">Login</h1>
      <form action={login} method="post">
        <div style={{marginBottom:12}}>
          <label>Email</label><br/>
          <input className="input" name="email" defaultValue="admin@example.com" />
        </div>
        <div style={{marginBottom:12}}>
          <label>Password</label><br/>
          <input className="input" name="password" type="password" defaultValue="admin123" />
        </div>
        <button className="button" type="submit">Sign in</button>
        <p style={{opacity:.8, fontSize:12, marginTop:8}}>Viewer: viewer@example.com / viewer123</p>
      </form>
    </div>
  );
}
