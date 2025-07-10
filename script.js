let quoteData = [];

// Load CSV
fetch('sa_quotes.csv')
  .then(response => response.text())
  .then(csv => {
    const lines = csv.trim().split('\n').slice(1); // Skip header
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
  const plan = document.getElementById('plan').value;

  if (gender === "" || gender === "UNKNOWN") gender = "F"; // default fallback

  const matches = quoteData
    .filter(q => q.state === state && q.gender === gender && q.plan === plan)
    .sort((a, b) => Math.abs(a.age - age) - Math.abs(b.age - age));

  const resultDiv = document.getElementById('result');

  if (matches.length > 0) {
    resultDiv.innerHTML = `
      <h2>${plan} – Secure Advantage</h2>
      <p>Monthly Premium: $${matches[0].price.toFixed(2)}</p>
    `;
  } else {
    resultDiv.innerHTML = `<h2>No matching quote found.</h2>`;
  }
});
