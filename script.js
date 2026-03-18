function calculate() {

    let T = parseFloat(get("T"));
    let v = parseFloat(get("v"));
    let D = parseFloat(get("D"));
    let A = parseFloat(get("A"));
    let L = parseFloat(get("L"));
    let flow_area = parseFloat(get("flow_area"));

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
        <div class="card"><div>Re</div><div class="value">${Re.toFixed(0)}</div></div>
        <div class="card"><div>h (W/m²K)</div><div class="value">${h.toFixed(2)}</div></div>

        <div class="card q"><div>Heat Q</div><div class="value">${Q.toFixed(0)} W</div></div>
        <div class="card dp"><div>ΔP</div><div class="value">${dP.toFixed(2)} Pa</div></div>

        <div class="card fan"><div>Fan Power</div><div class="value">${Wfan.toFixed(0)} W</div></div>
        <div class="card eff"><div>Efficiency</div><div class="value">${eff.toFixed(3)}</div></div>

        <div class="card"><div>Condensation</div><div class="value">${cond}</div></div>
    `;
}

function get(id){
    return document.getElementById(id).value;
}
