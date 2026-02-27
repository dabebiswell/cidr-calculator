import './style.css';
import { calculateCidr, isValidIpv4 } from './cidr';

// DOM Elements
const ipInput = document.getElementById('ipAddress') as HTMLInputElement;
const maskBitsSlider = document.getElementById('maskBits') as HTMLInputElement;
const maskBitsLabel = document.getElementById('maskBitsLabel') as HTMLElement;
const maskSelect = document.getElementById('maskSelect') as HTMLSelectElement;

// Output Elements
const outputs = {
  cidrNetmask: document.getElementById('cidrNetmask') as HTMLElement,
  wildcardMask: document.getElementById('wildcardMask') as HTMLElement,
  cidrNotation: document.getElementById('cidrNotation') as HTMLElement,
  cidrNetworkRoute: document.getElementById('cidrNetworkRoute') as HTMLElement,
  cidrAddressRange: document.getElementById('cidrAddressRange') as HTMLElement,
  broadcastAddress: document.getElementById('broadcastAddress') as HTMLElement,
  maximumAddresses: document.getElementById('maximumAddresses') as HTMLElement,
  usableAddresses: document.getElementById('usableAddresses') as HTMLElement,
};

// Clipboard toast
const toast = document.getElementById('toast') as HTMLElement;

// Main update function
function updateCalculations() {
  const ip = ipInput.value.trim();
  const maskBits = parseInt(maskBitsSlider.value, 10);

  // Update label
  maskBitsLabel.textContent = maskBits.toString();

  // Validate IP
  if (!isValidIpv4(ip)) {
    ipInput.classList.add('invalid');
    // Clear outputs or show error state
    Object.values(outputs).forEach(el => {
      el.textContent = 'Invalid IP';
      el.classList.remove('highlight');
    });
    return;
  }

  ipInput.classList.remove('invalid');

  // Calculate
  const result = calculateCidr(ip, maskBits);

  // Update DOM
  outputs.cidrNetmask.textContent = result.cidrNetmask;
  outputs.wildcardMask.textContent = result.wildcardMask;
  outputs.cidrNotation.textContent = result.cidrNotation;
  outputs.cidrNetworkRoute.textContent = result.cidrNetworkRoute;
  outputs.cidrAddressRange.textContent = result.cidrAddressRange;
  outputs.broadcastAddress.textContent = result.broadcastAddress;

  // Format numbers nicely with commas
  outputs.maximumAddresses.textContent = result.maximumAddresses.toLocaleString();
  outputs.usableAddresses.textContent = result.usableAddresses.toLocaleString();

  // Add subtle highlight animation class (optional if we want CSS to react)
  Object.values(outputs).forEach(el => {
    // Force reflow to restart animation if we had one
    el.classList.remove('highlight');
    void el.offsetWidth;
    el.classList.add('highlight');

    // remove highlight after it plays to allow playing again
    setTimeout(() => el.classList.remove('highlight'), 300);
  });
}

// Event Listeners
ipInput.addEventListener('input', updateCalculations);
maskBitsSlider.addEventListener('input', () => {
  maskSelect.value = maskBitsSlider.value;
  updateCalculations();
});
maskSelect.addEventListener('change', () => {
  maskBitsSlider.value = maskSelect.value;
  updateCalculations();
});

// Initialize mask dropdown options
function initMaskDropdown() {
  for (let i = 1; i <= 32; i++) {
    const maskStr = calculateCidr('0.0.0.0', i).cidrNetmask;
    const option = document.createElement('option');
    option.value = i.toString();
    option.textContent = `/${i} - ${maskStr}`;
    maskSelect.appendChild(option);
  }
  maskSelect.value = "24";
}

initMaskDropdown();

// Initial calculation
updateCalculations();

// Copy to Clipboard logic
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetId = (e.currentTarget as HTMLElement).getAttribute('data-target');
    if (targetId) {
      const textToCopy = document.getElementById(targetId)?.textContent;
      if (textToCopy && textToCopy !== 'Invalid IP' && textToCopy !== '-') {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast();
        });
      }
    }
  });
});

let toastTimeout: number;
function showToast() {
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
