function calculate() {
    let T = parseFloat(document.getElementById("T").value);
    let v = parseFloat(document.getElementById("v").value);
    let D = parseFloat(document.getElementById("D").value);
    let A = parseFloat(document.getElementById("A").value);
    let L = parseFloat(document.getElementById("L").value);
    let flow_area = parseFloat(document.getElementById("flow_area").value);

    // 烟气性质
    let cp = 1000;
    let rho = 1.2 * (300 / T);
    let mu = 1.8e-5;
    let k = 0.026;

    // 计算
    let Re = rho * v * D / mu;
    let Pr = cp * mu / k;
    let Nu = 0.023 * Math.pow(Re, 0.8) * Math.pow(Pr, 0.4);
    let h = Nu * k / D;

    let deltaT = T - 300;
    let Q = h * A * deltaT;

    // 压降
    let f = Re < 2300 ? 64 / Re : 0.3164 * Math.pow(Re, -0.25);
    let dP = f * (L / D) * (rho * v * v / 2);

    // 风机功耗
    let Wfan = dP * v * flow_area / 0.7;

    // 露点
    let dew = 273 + 55 + 20 * 0.1;
    let cond = T < dew;
    let Q_latent = cond ? 2.26e6 * 0.01 : 0;

    let Q_total = Q + Q_latent;

    let eff = (Q_total - Wfan) / Q_total;

    document.getElementById("result").innerHTML = `
        <p>h: ${h.toFixed(2)}</p>
        <p>Q: ${Q.toFixed(2)}</p>
        <p>Pressure Drop: ${dP.toFixed(2)} Pa</p>
        <p>Fan Power: ${Wfan.toFixed(2)} W</p>
        <p>Efficiency: ${eff.toFixed(3)}</p>
        <p>Condensation: ${cond}</p>
    `;
}
