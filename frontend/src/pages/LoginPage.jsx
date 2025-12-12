export default function LoginPage() {
    return(
        <div style={{ textAlign: "center", padding:"2rem"}}>
            <h2>Login / Register</h2>

            <input type="text" placeholder="Username" style={{ margin: "0.5rem", padding: "0.5rem" }} />
            <br />
            <input type="password" placeholder="Password" style={{ margin: "0.5rem", padding: "0.5rem" }} />
            <br />
            <button style={{ padding: "0.5rem 1rem" }}>Login</button>

            <p style={{ marginTop: "1rem" }}>
                Don't have an account? <a href="#">Register here</a>
            </p>
        </div>
    );
}