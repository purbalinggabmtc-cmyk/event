const API_URL = "https://script.google.com/macros/s/16y7qEu5b_Y88BBc2YYNlCNsGGkUCMIzpmst6YHXo4cc/exec";

function daftar() {
  const nama = document.getElementById("nama").value.trim();
  const nik5 = document.getElementById("nik5").value.trim();
  const message = document.getElementById("message");

  if (!nama) {
    message.style.color = "red";
    message.textContent = "Nama wajib diisi.";
    return;
  }

  if (!/^\d{5}$/.test(nik5)) {
    message.style.color = "red";
    message.textContent = "NIK harus 5 digit angka.";
    return;
  }

  message.style.color = "#ccc";
  message.textContent = "Memproses...";

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      nama: nama,
      nik5: nik5
    })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.success) {
      message.style.color = "red";
      message.textContent = data.message || "Pendaftaran gagal.";
      return;
    }

    document.getElementById("formCard").style.display = "none";
    document.getElementById("resultCard").style.display = "block";
    document.getElementById("hasilNama").textContent = "Nama: " + data.nama;
    document.getElementById("nomorUndian").textContent = data.nomorUndian;

    const qr = document.getElementById("qrcode");
    qr.innerHTML = "";
    new QRCode(qr, {
      text: data.qrCode,
      width: 220,
      height: 220
    });
  })
  .catch(err => {
    console.error(err);
    message.style.color = "red";
    message.textContent = "Terjadi kesalahan koneksi.";
  });
}
