export interface CidrCalculationResult {
    ipAddress: string;
    maskBits: number;
    cidrNetmask: string;
    wildcardMask: string;
    maximumSubnets: number;
    maximumAddresses: number;
    usableAddresses: number;
    cidrNetworkRoute: string;
    cidrNotation: string;
    cidrAddressRange: string;
    broadcastAddress: string;
}

export function ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function numberToIp(num: number): string {
    return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
    ].join('.');
}

export function calculateCidr(ipAddress: string, maskBits: number): CidrCalculationResult {
    const ipNum = ipToNumber(ipAddress);

    // Subnet mask number
    // Be careful with bitwise operators in JS for 32 bits. Use BigInt or carefully shift.
    // ~0 creates -1 (all 1s), we shift it left by 32 - maskBits.
    // E.g., maskBits = 24 => shift left by 8 => 255.255.255.0
    const maskNum = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0;

    const wildcardNum = (~maskNum) >>> 0;

    const networkNum = (ipNum & maskNum) >>> 0;
    const broadcastNum = (networkNum | wildcardNum) >>> 0;

    const cidrNetmask = numberToIp(maskNum);
    const wildcardMask = numberToIp(wildcardNum);

    // Max Subnets for classful (legacy)
    // Determine class:
    let defaultMaskBits = 24; // Class C
    const firstOctet = parseInt(ipAddress.split('.')[0], 10);

    if (firstOctet >= 1 && firstOctet <= 126) {
        defaultMaskBits = 8; // Class A
    } else if (firstOctet >= 128 && firstOctet <= 191) {
        defaultMaskBits = 16; // Class B
    } else if (firstOctet >= 192 && firstOctet <= 223) {
        defaultMaskBits = 24; // Class C
    } else {
        // Class D/E or 127 loopback -> no standard classful subnets
        defaultMaskBits = -1;
    }

    let maximumSubnets = 0;
    if (defaultMaskBits !== -1) {
        if (maskBits >= defaultMaskBits) {
            maximumSubnets = Math.pow(2, maskBits - defaultMaskBits);
        } else {
            // Subnetting a supernet (e.g. 192.168.0.0/22)
            // Standard subnet calculators show 0 subnets if borrowing is negative relative to the classful boundary.
            maximumSubnets = 0;
        }
    }

    // Maximum Addresses (total IPs including network and broadcast)
    const maximumAddresses = Math.pow(2, 32 - maskBits);

    // Usable Addresses
    const usableAddresses = maskBits >= 31 ? 0 : maximumAddresses - 2;

    const cidrNetworkRoute = numberToIp(networkNum);
    const cidrNotation = `${cidrNetworkRoute}/${maskBits}`;
    const broadcastAddress = numberToIp(broadcastNum);

    // Range
    let rangeStartIp = numberToIp((networkNum + 1) >>> 0);
    let rangeEndIp = numberToIp((broadcastNum - 1) >>> 0);

    // Handle edge cases like /32 and /31
    if (maskBits === 32) {
        rangeStartIp = cidrNetworkRoute;
        rangeEndIp = cidrNetworkRoute;
    } else if (maskBits === 31) {
        rangeStartIp = cidrNetworkRoute;
        rangeEndIp = broadcastAddress;
    }

    const cidrAddressRange = `${rangeStartIp} - ${rangeEndIp}`;

    return {
        ipAddress,
        maskBits,
        cidrNetmask,
        wildcardMask,
        maximumSubnets,
        maximumAddresses,
        usableAddresses,
        cidrNetworkRoute,
        cidrNotation,
        cidrAddressRange,
        broadcastAddress
    };
}

// Basic Regex for valid IPv4
export function isValidIpv4(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    for (const part of parts) {
        if (!/^\d+$/.test(part)) return false;
        const num = parseInt(part, 10);
        if (num < 0 || num > 255) return false;
        if (part.length > 1 && part.startsWith('0')) return false; // Basic check for leading zeros
    }
    return true;
}
