let quoteData = [];

fetch('sa_quotes.csv')
  .then(response => response.text())
  .then(csv => {
    const lines = csv.trim().split('\n').slice(1);
    quoteData = lines.map(line => {
      const [state, age, gender, plan, price] = line.split(',');
      return {
        state: state.trim().toUpperCase(),
        age: parseInt(age.trim()),
        gender: gender.trim().toUpperCase(),
        plan: plan.trim(),
        price: parseFloat(price.trim())
      };
    });
  });

document.getElementById('quote-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const state = document.getElementById('state').value.trim().toUpperCase();
  const age = parseInt(document.getElementById('age').value);
  let gender = document.getElementById('gender').value.trim().toUpperCase();
  const upgradeValue = parseFloat(document.getElementById('association').value);

  if (gender === "" || gender === "UNKNOWN") gender = "F";

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "";

  const healthPlusPlan = (state === "IL") ? "Health Plus Plan 3" : "Health Plus Plan 2";

  const planDescriptions = {
    SA1: "Coinsurance 70%/30%, $5K Sickness Deductible, $5K Accident Deductible",
    SA2: "Coinsurance 70%/30%, $2.5K Sickness Deductible, $5K Accident Deductible",
    SA3: "Coinsurance 80%/20%, $5K Sickness Deductible, $5K Accident Deductible",
    SA4: "Coinsurance 80%/20%, $2.5K Sickness Deductible, $5K Accident Deductible"
  };

  const options = ["SA1", "SA2", "SA3", "SA4"];

  options.forEach((planKey, i) => {
    const matches = quoteData
      .filter(q => q.state === state && q.gender === gender && q.plan === planKey)
      .sort((a, b) => Math.abs(a.age - age) - Math.abs(b.age - age));

    if (matches.length > 0) {
      const base = matches[0].price;
      const total = base + upgradeValue;

      resultDiv.innerHTML += `
        <h3>Option ${i + 1}: Secure Advantage</h3>
        <p>${planDescriptions[planKey]} – ${healthPlusPlan} – Minimum MedGuard – Quote: $${total.toFixed(2)}</p>
      `;
    } else {
      resultDiv.innerHTML += `<p>No quote found for ${planKey}.</p>`;
    }
  });
});
