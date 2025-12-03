import { hashPassword, comparePassword } from '../../src/utils/bcrypt';

describe('Bcrypt Utility', () => {
  const plainPassword = 'testPassword123';

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hashed = await hashPassword(plainPassword);
      
      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(plainPassword);
      expect(hashed.length).toBeGreaterThan(50); // bcrypt hashes are long
    });

    it('should generate different hashes for the same password', async () => {
      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);
      
      // bcrypt includes salt, so same password gives different hashes
      expect(hash1).not.toBe(hash2);
    });

    it('should hash different passwords differently', async () => {
      const hash1 = await hashPassword('password1');
      const hash2 = await hashPassword('password2');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const hashed = await hashPassword(plainPassword);
      const result = await comparePassword(plainPassword, hashed);
      
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hashed = await hashPassword(plainPassword);
      const result = await comparePassword('wrongPassword', hashed);
      
      expect(result).toBe(false);
    });

    it('should work with different hash instances of same password', async () => {
      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);
      
      // Both hashes should verify the original password
      expect(await comparePassword(plainPassword, hash1)).toBe(true);
      expect(await comparePassword(plainPassword, hash2)).toBe(true);
    });

    it('should return false for empty password', async () => {
      const hashed = await hashPassword(plainPassword);
      const result = await comparePassword('', hashed);
      
      expect(result).toBe(false);
    });
  });
});

