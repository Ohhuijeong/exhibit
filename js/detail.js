import { supabase, escapeHTML, won } from './common.js';

const status = document.querySelector('#detail-status');
const content = document.querySelector('#detail-content');
const imageWrap = document.querySelector('#detail-image-wrap');

async function loadArtwork() {
    const id = new URLSearchParams(window.location.search).get('id')?.trim();

    if (!id) {
        status.textContent = '작품 정보가 지정되지 않았습니다.';
        return;
    }

    const { data: artwork, error } = await supabase
        .from('exhibition')
        .select('title, artist, description, price, rental_price, image_url')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        status.textContent = `작품 조회 오류: ${error.message}`;
        return;
    }

    if (!artwork) {
        status.textContent = '해당 작품을 찾을 수 없습니다.';
        return;
    }

    imageWrap.innerHTML = artwork.image_url
        ? `<img class="detail-image" src="${escapeHTML(artwork.image_url)}" alt="${escapeHTML(artwork.title)}">`
        : '<div class="no-image">EXHIBIT</div>';
    document.querySelector('#detail-title').textContent = artwork.title || '';
    document.querySelector('#detail-artist').textContent = artwork.artist || '';
    document.querySelector('#detail-description').textContent = artwork.description || '등록된 작품 설명이 없습니다.';
    document.querySelector('#detail-price').textContent = won(artwork.price);
    document.querySelector('#detail-rental-price').textContent = won(artwork.rental_price);
    document.title = `${artwork.title || '작품 상세'} | EXHIBIT`;

    status.hidden = true;
    content.hidden = false;
}

loadArtwork();
