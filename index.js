
function populateTable(data) {
  const table = document.getElementById('tablePengiriman');
  const tbody = table.getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  data.forEach(entry => {
    const row = tbody.insertRow();
    for (const key in entry) {
      const cell = row.insertCell();
      if (key === 'tanggal') {
        const formattedDate = formatDate(new Date(entry[key]));
        cell.textContent = formattedDate;
      } else {
        cell.textContent = entry[key];
      }
    }
  });
}


function cariNamaPenerima() {
  let cariNama = $('#cariNamaPenerima').val();

  // Lakukan permintaan ke server untuk mencari data berdasarkan nama penerima
  $.ajax({
    url: `http://localhost:3000/pengiriman/nama_penerima/${cariNama}`,
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      // Panggil fungsi untuk menampilkan data di tabel
      populateTable(data);
    },
    error: function(error) {
      console.error('Error:', error);
    }
  });
}




// Menangani klik tombol "Cari"
$('#btnCari').click(cariNamaPenerima);

// Ambil data dari server dan panggil fungsi untuk menampilkan di tabel
function fetchDataAndPopulateTable() {
  $.ajax({
    url: 'http://localhost:3000/pengiriman',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      populateTable(data);
    },
    error: function(error) {
      console.error('Error:', error);
    }
  });
}

fetchDataAndPopulateTable(); // Panggil saat halaman dimuat

$('#formPengiriman').submit(function(event) {
  event.preventDefault();

  let nama = $('#nama').val();
  let alamat = $('#alamat').val();
  let kota = $('#kota').val();
  let provinsi = $('#provinsi').val();
  let kodepos = $('#kodepos').val();

  let infoPengiriman = {
    nama: nama,
    alamat: alamat,
    kota: kota,
    provinsi: provinsi,
    kodepos: kodepos
  };

  let namaPenerima = $('#namaPenerima').val();
  let alamatPenerima = $('#alamatPenerima').val();
  let kotaPenerima = $('#kotaPenerima').val();
  let provinsiPenerima = $('#provinsiPenerima').val();
  let kodeposPenerima = $('#kodeposPenerima').val();

  let infoPenerima = {
    nama: namaPenerima,
    alamat: alamatPenerima,
    kota: kotaPenerima,
    provinsi: provinsiPenerima,
    kodepos: kodeposPenerima
  };

  let tanggal = $('#tanggal').val(); // Ambil nilai tanggal
  let berat = parseFloat($('#berat').val()); // Ambil nilai berat dan konversi ke float
  let totalHarga = 0; // Inisialisasi total harga

  // Hitung total harga berdasarkan berat (misalnya, harga per kg adalah 10 ribu)
  const hargaPerKg = 25000;
  totalHarga = berat * hargaPerKg;

  // Tampilkan total harga pada elemen HTML
  $('#totalHarga').text(`Rp ${totalHarga}`); // Ubah format harga sesuai kebutuhan

  let data = {
    pengirim: infoPengiriman,
    penerima: infoPenerima,
    tanggal: tanggal,
    berat: berat, // Sertakan berat dalam data
    totalHarga: totalHarga // Sertakan total harga dalam data
  };

  $.ajax({
    url: 'http://localhost:3000/pengiriman',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    dataType: 'json',
    success: function(data) {
      alert(data.message);

      // Setelah berhasil menyimpan, perbarui tabel
      fetchDataAndPopulateTable();
    },
    error: function(error) {
      console.error('Error:', error);
    }
  });
});

// Fungsi untuk mengubah format tanggal ke "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
