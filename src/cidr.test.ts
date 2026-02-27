import { calculateCidr, isValidIpv4 } from './cidr';

function assertEqual(actual: any, expected: any, message: string) {
    if (actual !== expected) {
        throw new Error(`Test Failed: ${message}\nExpected: ${expected}\nActual: ${actual}`);
    }
}

console.log('Running CIDR unit tests...');

// Test valid IP
assertEqual(isValidIpv4('192.168.0.1'), true, '192.168.0.1 should be valid');
assertEqual(isValidIpv4('256.0.0.1'), false, '256.0.0.1 should be invalid');
assertEqual(isValidIpv4('192.168.0'), false, '192.168.0 should be invalid');

// Test calculation for 66.10.5.32/24 based on our spec
const res1 = calculateCidr('66.10.5.32', 24);
assertEqual(res1.cidrNetmask, '255.255.255.0', 'Netmask /24');
assertEqual(res1.wildcardMask, '0.0.0.255', 'Wildcard /24');
assertEqual(res1.cidrNetworkRoute, '66.10.5.0', 'Network route /24');
assertEqual(res1.cidrNotation, '66.10.5.0/24', 'CIDR notation /24');
assertEqual(res1.cidrAddressRange, '66.10.5.1 - 66.10.5.254', 'Range /24');
assertEqual(res1.usableAddresses, 254, 'Usable addresses /24');
assertEqual(res1.broadcastAddress, '66.10.5.255', 'Broadcast /24');

// Test calculation for /32
const res32 = calculateCidr('10.0.0.5', 32);
assertEqual(res32.cidrNetmask, '255.255.255.255', 'Netmask /32');
assertEqual(res32.wildcardMask, '0.0.0.0', 'Wildcard /32');
assertEqual(res32.usableAddresses, 0, 'Usable addresses /32');
assertEqual(res32.cidrAddressRange, '10.0.0.5 - 10.0.0.5', 'Range /32');

// Test supernet max subnets / addresses
const maxSubnetsRes = calculateCidr('192.168.1.1', 25); // Class C normally /24
assertEqual(maxSubnetsRes.maximumSubnets, 2, 'Max subnets for /25 in Class C');

console.log('All CIDR unit tests passed successfully!');
