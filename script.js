document.addEventListener('DOMContentLoaded', function() {
    // Element references
    const qrText = document.getElementById('qr-text');
    const qrColor = document.getElementById('qr-color');
    const qrBgColor = document.getElementById('qr-bgcolor');
    const qrSize = document.getElementById('qr-size');
    const generateBtn = document.getElementById('generate-btn');
    const qrContainer = document.getElementById('qr-container');
    const qrCode = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('download-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMessage = document.getElementById('error-message');
    const contentType = document.getElementById('content-type');
    const advancedOptions = document.getElementById('advanced-options');
    const wifiOptions = document.getElementById('wifi-options');
    const wifiPassword = document.getElementById('wifi-password');
    const contactOptions = document.getElementById('contact-options');
    const contactPhone = document.getElementById('contact-phone');

    // Event listeners
    generateBtn.addEventListener('click', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);
    clearBtn.addEventListener('click', clearAll);
    contentType.addEventListener('change', toggleAdvancedOptions);

    function toggleAdvancedOptions() {
        const type = contentType.value;
        advancedOptions.classList.add('hidden');
        wifiOptions.classList.add('hidden');
        contactOptions.classList.add('hidden');
        
        if (type === 'wifi' || type === 'contact') {
            advancedOptions.classList.remove('hidden');
            if (type === 'wifi') {
                wifiOptions.classList.remove('hidden');
            } else if (type === 'contact') {
                contactOptions.classList.remove('hidden');
            }
        }
    }

    function generateQRCode() {
        errorMessage.classList.add('hidden');
        
        let text = qrText.value.trim();
        if (!text) {
            showError('Please enter some content');
            return;
        }
        
        const type = contentType.value;
        
        // Format content based on type
        switch(type) {
            case 'url':
                if (!text.startsWith('http://') && !text.startsWith('https://')) {
                    text = 'https://' + text;
                }
                break;
                
            case 'wifi':
                const password = wifiPassword.value.trim() || 'password';
                text = `WIFI:T:WPA;S:${text};P:${password};;`;
                break;
                
            case 'contact':
                const phone = contactPhone.value.trim() || '';
                text = `BEGIN:VCARD\nVERSION:3.0\nFN:${text}\nTEL:${phone}\nEND:VCARD`;
                break;
                
            case 'email':
                text = `mailto:${text}`;
                break;
                
            case 'sms':
                text = `SMSTO:${text}`;
                break;
        }
        
        const color = qrColor.value.substring(1);
        const bgColor = qrBgColor.value.substring(1);
        const size = qrSize.value;
        
        const apiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=${size}&color=${color}&bgcolor=${bgColor}`;
        
        qrCode.src = apiUrl;
        qrContainer.classList.remove('hidden');
    }

    function downloadQRCode() {
        if (!qrContainer.classList.contains('hidden')) {
            const link = document.createElement('a');
            link.href = qrCode.src;
            link.download = `qr-code-${contentType.value}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    function clearAll() {
        qrText.value = '';
        qrColor.value = '#000000';
        qrBgColor.value = '#ffffff';
        qrSize.value = '200';
        contentType.value = 'plain';
        wifiPassword.value = '';
        contactPhone.value = '';
        qrContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
        advancedOptions.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
});