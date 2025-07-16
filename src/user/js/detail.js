document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('reservationModal');
  const reservationItems = document.querySelectorAll('.reservation-item');
  const cancelButton = document.getElementById('cancelButton');
  const modalDataSpans = {
    namaPasien: document.getElementById('modal-nama-pasien'),
    umur: document.getElementById('modal-umur'),
    jenisKelamin: document.getElementById('modal-jenis-kelamin'),
    keterangan: document.getElementById('modal-keterangan'),
    supir: document.getElementById('modal-supir'),
    kendaraan: document.getElementById('modal-kendaraan'),
    status: document.getElementById('modal-status'),
    timestamp: document.getElementById('modal-timestamp')
  };

  reservationItems.forEach(item => {
    item.addEventListener('click', () => {
      const data = item.dataset;
      modalDataSpans.namaPasien.textContent = data.namaPasien || 'N/A';
      modalDataSpans.umur.textContent = data.umur || 'N/A';
      modalDataSpans.jenisKelamin.textContent = data.jenisKelamin || 'N/A';
      modalDataSpans.keterangan.textContent = data.keterangan || 'N/A';
      modalDataSpans.supir.textContent = data.supir || 'N/A';
      modalDataSpans.kendaraan.textContent = data.kendaraan || 'N/A';
      modalDataSpans.status.textContent = data.status || 'N/A';
      modalDataSpans.timestamp.textContent = data.timestamp || 'N/A';
      modal.classList.remove('hidden');
    });
  });
  function closeModal() {
    modal.classList.add('hidden');
  }
  cancelButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
});
