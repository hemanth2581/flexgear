import { OtpService } from '../lib/services/otp.service';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 FLEXGEAR SUPABASE OTP AUTHENTICATION TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Phone Normalization
  console.log('Test 1: Phone Normalization');
  const n1 = OtpService.normalizePhone('9876543210');
  const n2 = OtpService.normalizePhone('+919876543210');
  const n3 = OtpService.normalizePhone('919876543210');
  const isValid = OtpService.isValidIndianMobile('9876543210');
  const isInvalid = OtpService.isValidIndianMobile('123456');

  console.log(`  '9876543210' -> ${n1} (Expected: +919876543210) [${n1 === '+919876543210' ? 'PASS' : 'FAIL'}]`);
  console.log(`  '+919876543210' -> ${n2} (Expected: +919876543210) [${n2 === '+919876543210' ? 'PASS' : 'FAIL'}]`);
  console.log(`  '919876543210' -> ${n3} (Expected: +919876543210) [${n3 === '+919876543210' ? 'PASS' : 'FAIL'}]`);
  console.log(`  Valid Indian Mobile check: ${isValid ? 'PASS' : 'FAIL'}`);
  console.log(`  Invalid number rejection: ${!isInvalid ? 'PASS' : 'FAIL'}`);

  // Test 2: Send OTP
  console.log('\nTest 2: Send OTP to +91 9876543210');
  const testPhone = '9876543210';
  const sendRes = await OtpService.sendOtp(testPhone);
  console.log(`  Send result: success=${sendRes.success}, message=${sendRes.message} [${sendRes.success ? 'PASS' : 'FAIL'}]`);

  // Test 3: Invalid OTP Code
  console.log('\nTest 3: Verify with Wrong OTP Code');
  const wrongRes = await OtpService.verifyOtp(testPhone, '000000');
  console.log(`  Wrong OTP result: success=${wrongRes.success}, error="${wrongRes.message}" [${!wrongRes.success ? 'PASS' : 'FAIL'}]`);

  // Test 4: Rate Limiting
  console.log('\nTest 4: Rate Limiting & Cooldown Protection');
  await OtpService.sendOtp(testPhone);
  await OtpService.sendOtp(testPhone);
  const rateLimitRes = await OtpService.sendOtp(testPhone);
  console.log(`  Rate limit triggered: success=${rateLimitRes.success}, message="${rateLimitRes.message}" [${!rateLimitRes.success ? 'PASS' : 'FAIL'}]`);

  console.log('\n====================================================');
  console.log('✅ ALL LOCAL TESTS COMPLETED');
  console.log('====================================================');
}

runTests().catch(console.error);
