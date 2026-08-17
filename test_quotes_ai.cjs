const fetch = require('node-fetch');
async function run() {
  const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const catalog = [
    { id: "1", category: "product", items: ["Black office chair"] },
    { id: "2", category: "product", items: ["Wooden desk"] }
  ];
  
  const res = await fetch('http://localhost:3000/api/visual-match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageData: "data:image/png;base64," + base64Data,
      catalog
    })
  });
  console.log(await res.json());
}
run();
