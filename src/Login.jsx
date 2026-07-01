function Login({onLog}) {
    return(
        <div id="content">
            <div id="login-card">
                <div id="header">
                    <h2></h2>
                    <h4></h4>
                </div>
                <div id="form">
                    <h4>Nickname</h4>
                    <input type="text" />
                    <input type="file" />
                </div>
                <button onClick={onLog}>Jugar!</button>
                <div id="testimonial-card">
                    <h5>User name</h5>
                    {/* <img src="" alt=""/> */}
                    <h6>1000$</h6>

                </div>
            </div>
            <div id="footer">

            </div>
        </div>
    )
}
export default Login