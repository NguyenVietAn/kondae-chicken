document.addEventListener('DOMContentLoaded', function() {

    // 1. MENU 3 GẠCH (MOBILE)
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. TẢI DỮ LIỆU THỰC ĐƠN TỪ JSON
    async function loadMenuData() {
        const menuGrid = document.getElementById('menu-grid');
        if (!menuGrid) return;
        try {
            const res = await fetch(`data/menu.json?v=${new Date().getTime()}`);
            const data = await res.json();
            menuGrid.innerHTML = '';
            data.items.forEach(item => {
                if (item.is_visible === false) return;
                const div = document.createElement('div');
                div.className = 'menu-item';
                div.dataset.category = item.category;
                div.innerHTML = `
                    <div class="menu-item-img">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="menu-item-info">
                        <div class="menu-item-header">
                            <h3>${item.name}</h3>
                            <span class="price">${item.price}</span>
                        </div>
                        <p>${item.description}</p>
                    </div>
                `;
                menuGrid.appendChild(div);
            });
            setupMenuFilter();
        } catch (error) { console.error('Lỗi tải menu:', error); }
    }

    function setupMenuFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const menuItems = document.querySelectorAll('.menu-item');
        const noResults = document.getElementById('no-results');
        if (filterButtons.length > 0 && menuItems.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    const category = this.dataset.category;
                    let count = 0;
                    menuItems.forEach(item => {
                        if (category === 'all' || item.dataset.category === category) {
                            item.classList.remove('hidden'); count++;
                        } else { item.classList.add('hidden'); }
                    });
                    if (noResults) noResults.hidden = count > 0;
                });
            });
        }
    }

    // 3. TẢI DỮ LIỆU TRANG CÂU CHUYỆN TỪ JSON
    async function loadStoryData() {
        if (!document.getElementById('story-heading')) return;
        try {
            const res = await fetch(`data/story.json?v=${new Date().getTime()}`);
            const data = await res.json();
            document.getElementById('story-hero-title').textContent = data.hero_title || '';
            document.getElementById('story-hero-subtitle').textContent = data.hero_subtitle || '';
            document.getElementById('story-heading').textContent = data.story_heading || '';
            const pContainer = document.getElementById('story-paragraphs');
            pContainer.innerHTML = '';
            if (data.story_paragraphs) {
                data.story_paragraphs.forEach(p => {
                    const pEl = document.createElement('p');
                    pEl.textContent = p.paragraph || p; 
                    pContainer.appendChild(pEl);
                });
            }
            const mediaContainer = document.getElementById('story-media-container');
            mediaContainer.innerHTML = '';
            if (data.story_video) {
                mediaContainer.innerHTML = `<video src="${data.story_video}" controls style="width:100%; border-radius:var(--border-radius);"></video>`;
            } else if (data.story_image) {
                mediaContainer.innerHTML = `<img src="${data.story_image}" alt="Câu chuyện KONDAE" loading="lazy">`;
            }
            const teamContainer = document.getElementById('team-image-container');
            teamContainer.innerHTML = '';
            if (data.team_image) {
                teamContainer.innerHTML = `<img src="${data.team_image}" alt="Đội ngũ KONDAE" loading="lazy">`;
            }
            const commitmentList = document.getElementById('commitment-list');
            commitmentList.innerHTML = '';
            if (data.commitments) {
                data.commitments.forEach(item => {
                    const text = item.item || item;
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${text.split(':')[0]}:</strong>${text.split(':').slice(1).join(':')}`;
                    commitmentList.appendChild(li);
                });
            }
        } catch (error) { console.error('Lỗi tải câu chuyện:', error); }
    }

    // 4. TẢI DỮ LIỆU GALLERY
    async function loadGalleryData() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;
        try {
            const res = await fetch(`data/gallery.json?v=${new Date().getTime()}`);
            const data = await res.json();
            galleryGrid.innerHTML = '';
            data.items.forEach(item => {
                const wrapper = document.createElement('div');
                if (item.media_type === 'video') {
                    wrapper.innerHTML = `<video src="${item.media}" controls style="width:100%; height:300px; object-fit:cover; border-radius:var(--border-radius);"></video>`;
                } else {
                    wrapper.innerHTML = `<img src="${item.media}" alt="${item.title}" loading="lazy">`;
                }
                galleryGrid.appendChild(wrapper);
            });
        } catch (error) { console.error('Lỗi tải gallery:', error); }
    }

    // 5. XỬ LÝ FORM ĐẶT HÀNG
    const SDT_ZALO = '0347520628';
    const LINK_FACEBOOK = 'https://www.facebook.com/share/1Ja61uugF7/?mibextid=wwXIfr';

    function openZalo(phone) {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            window.open(`https://zalo.me/${phone}`, '_blank');
        } else {
            const deepLink = `zalo://conversation?phone=${phone}`;
            const webFallback = `https://zalo.me/${phone}`;
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = deepLink;
            document.body.appendChild(iframe);
            setTimeout(() => {
                if (document.body.contains(iframe)) document.body.removeChild(iframe);
                window.open(webFallback, '_blank');
            }, 2000);
        }
    }

    function guiTinNhanDaKenh(noiDung, kenh) {
        if (kenh === 'facebook') {
            navigator.clipboard.writeText(noiDung).then(() => {
                alert('Đã sao chép nội dung!\n\nVui lòng nhấn "Dán" (Paste) vào cửa sổ chat Facebook vừa mở để gửi cho nhà hàng.');
                window.open(LINK_FACEBOOK, '_blank');
            }).catch(() => {
                alert('Không thể tự động sao chép. Vui lòng copy thủ công nội dung sau và gửi qua Facebook:\n\n' + noiDung);
                window.open(LINK_FACEBOOK, '_blank');
            });
        } else {
            navigator.clipboard.writeText(noiDung).then(() => {
                alert('Đã sao chép nội dung!\n\nVui lòng nhấn giữ vào ô nhập tin nhắn trong Zalo và chọn "Dán" (Paste), sau đó ấn Gửi.');
                openZalo(SDT_ZALO);
            }).catch(() => {
                alert('Không thể tự động sao chép. Vui lòng copy thủ công nội dung sau và gửi qua Zalo:\n\n' + noiDung);
                openZalo(SDT_ZALO);
            });
        }
    }

    function validateForm(form) {
        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) { firstInvalid.focus(); firstInvalid.reportValidity(); }
            return false;
        }
        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
            const phone = phoneInput.value.replace(/\s/g, '');
            if (!/^0\d{9,10}$/.test(phone)) {
                alert('Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0).');
                phoneInput.focus(); return false;
            }
        }
        const dateInput = form.querySelector('input[type="date"]');
        if (dateInput && dateInput.value) {
            const selectedDate = new Date(dateInput.value);
            const today = new Date(); today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                alert('Ngày đặt bàn không được ở quá khứ.');
                dateInput.focus(); return false;
            }
        }
        return true;
    }

    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        const bookingDate = document.getElementById('booking-date');
        if (bookingDate) {
            const today = new Date().toISOString().split('T')[0];
            bookingDate.setAttribute('min', today);
        }
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!validateForm(this)) return;
            const ten = document.getElementById('booking-name').value.trim();
            const sdt = document.getElementById('booking-phone').value.trim();
            const ngay = document.getElementById('booking-date').value;
            const gio = document.getElementById('booking-time').value;
            const soNguoi = document.getElementById('booking-guests').value;
            const ghiChu = document.getElementById('booking-note').value.trim() || 'Không có';
            const ngayHienThi = ngay.split('-').reverse().join('/');
            const kenh = this.querySelector('input[name="contact-channel"]:checked').value;
            const noiDung = `Xin chào KONDAE CHICKEN, mình muốn đặt bàn:\n- Họ tên: ${ten}\n- SĐT: ${sdt}\n- Ngày: ${ngayHienThi}\n- Giờ: ${gio}\n- Số người: ${soNguoi}\n- Ghi chú: ${ghiChu}\n\nMong nhà hàng xác nhận. Cảm ơn!`;
            guiTinNhanDaKenh(noiDung, kenh);
        });
    }

    const deliveryForm = document.getElementById('delivery-form');
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!validateForm(this)) return;
            const ten = document.getElementById('delivery-name').value.trim();
            const sdt = document.getElementById('delivery-phone').value.trim();
            const diaChi = document.getElementById('delivery-address').value.trim();
            const monAn = document.getElementById('delivery-items').value.trim();
            const ghiChu = document.getElementById('delivery-note').value.trim() || 'Không có';
            const kenh = this.querySelector('input[name="contact-channel"]:checked').value;
            const noiDung = `Xin chào KONDAE CHICKEN, mình muốn đặt ship:\n- Họ tên: ${ten}\n- SĐT: ${sdt}\n- Địa chỉ: ${diaChi}\n- Món đặt: ${monAn}\n- Ghi chú: ${ghiChu}\n\nMong nhà hàng xác nhận đơn. Cảm ơn!`;
            guiTinNhanDaKenh(noiDung, kenh);
        });
    }

    loadMenuData();
    loadStoryData();
    loadGalleryData();
});