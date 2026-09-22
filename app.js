/*******************************************************
 *  FRONTEND PENDAFTARAN EVENT
 *******************************************************/

const API_URL = "https://script.google.com/macros/s/AKfycbyg3sDxkMVUHMQbQGFZIXdOfhm2VACuM-rr8FMYO12eBlpEa3REXJ-ctN5HlqXok1lCUw/exec";

/* ===== Kirim pendaftaran ===== */
function daftar() {
  const namaInput = document.getElementById("nama");
  const pinInput  = document.getElementById("pin");
  const btn       = document.getElementById("btnDaftar");
  const btnText   = document.getElementById("btnText");

  const nama = namaInput.value.trim();
  const pin  = pinInput.value.trim();

  setMessage("", "");

  // Validasi
  if (nama.length < 2) {
    setMessage("Nama minimal 2 karakter.", "error");
    namaInput.focus();
    return;
  }
  if (!/^\d{5}$/.test(pin)) {
    setMessage("PIN harus tepat 5 digit angka.", "error");
    pinInput.focus();
    return;
  }

  // Loading
  btn.disabled = true;
  btnText.textContent = "MEMPROSES...";
  setMessage("Sedang mengirim data...", "info");

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ nama: nama, pin: pin })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        setMessage(data.message || "Pendaftaran gagal.", "error");
        resetButton();
        return;
      }
      tampilkanHasil(data);
    })
    .catch(err => {
      console.error(err);
      setMessage("Gagal terhubung ke server. Coba lagi.", "error");
      resetButton();
    });
}

/* ===== Tampilkan hasil ===== */
function tampilkanHasil(data) {
  document.getElementById("formCard").style.display = "none";

  document.getElementById("hasilNama").textContent   = data.nama;
  document.getElementById("nomorUndian").textContent = data.nomorUndian;

  const qrBox = document.getElementById("qrcode");
  qrBox.innerHTML = "";
  new QRCode(qrBox, {
    text: data.qrCode,
    width: 220,
    height: 220,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  document.getElementById("resultCard").classList.add("show");
}

/* ===== Daftar lagi ===== */
function daftarLagi() {
  document.getElementById("nama").value = "";
  document.getElementById("pin").value  = "";
  document.getElementById("qrcode").innerHTML = "";

  document.getElementById("resultCard").classList.remove("show");
  document.getElementById("formCard").style.display = "block";

  setMessage("", "");
  resetButton();
  document.getElementById("nama").focus();
}

/* ===== Helper ===== */
function setMessage(text, type) {
  const el = document.getElementById("message");
  el.textContent = text;
  el.className = "message" + (type ? " " + type : "");
}

function resetButton() {
  const btn = document.getElementById("btnDaftar");
  document.getElementById("btnText").textContent = "DAFTAR";
  btn.disabled = false;
}
