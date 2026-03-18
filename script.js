function calculate() {

    let T = parseFloat(T_input("T"));
    let v = parseFloat(T_input("v"));
    let D = parseFloat(T_input("D"));
    let A = parseFloat(T_input("A"));
    let L = parseFloat(T_input("L"));
    let flow_area = parseFloat(T_input("flow_area"));

    let cp = 1000;
    let rho = 1.2 * (300 / T);
    let mu = 1.8e-5;
    let k = 0.026;

    let Re = rho * v * D / mu;
    let Pr = cp * mu / k;
    let Nu = 0.023 * Math.pow(Re, 0.8) * Math.pow(Pr, 0.4);
    let h = Nu * k / D;

    let deltaT = T - 300;
    let Q = h * A * deltaT;

    let f = Re < 2300 ? 64 / Re : 0.3164 * Math.pow(Re, -0.25);
    let dP = f * (L / D) * (rho * v * v / 2);

    let Wfan = dP * v * flow_area / 0.7;

    let dew = 273 + 55 + 2;
    let cond = T < dew;

    let Q_total = Q + (cond ? 2.26e6 * 0.01 : 0);

    let eff = (Q_total - Wfan) / Q_total;

    document.getElementById("result").innerHTML = `
        <div class="card">Re: ${Re.toFixed(0)}</div>
        <div class="card">h: ${h.toFixed(2)} W/m²K</div>
        <div class="card">Q: ${Q.toFixed(2)} W</div>
        <div class="card">ΔP: ${dP.toFixed(2)} Pa</div>
        <div class="card">Fan Power: ${Wfan.toFixed(2)} W</div>
        <div class="card">Efficiency: ${eff.toFixed(3)}</div>
        <div class="card">Condensation: ${cond}</div>
    `;
}

function T_input(id){
    return document.getElementById(id).value;
}
