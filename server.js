require("dotenv").config();

const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const PORT = 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY,
);

app.use(express.static(__dirname));

app.get("/api/produtos", async (req, res) => {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("ativo", true);

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return res.status(500).json({
      erro: error.message,
    });
  }

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
