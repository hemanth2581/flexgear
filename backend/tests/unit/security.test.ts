// backend/tests/unit/security.test.ts
import { describe, it, expect } from 'vitest';
import { requireAdmin, requireRole } from '../../src/middleware/auth.middleware';
import { AuthenticatedRequest } from '../../src/types/auth.types';

describe('Security & RBAC Middleware Enforcement', () => {
  it('should block unauthenticated requests lacking user payload', () => {
    const mockReq = {} as AuthenticatedRequest;
    let statusSent = 0;
    let errorJson: any = null;

    const mockRes: any = {
      status: (code: number) => {
        statusSent = code;
        return {
          json: (data: any) => {
            errorJson = data;
          },
        };
      },
    };
    const mockNext = () => {};

    requireAdmin(mockReq, mockRes, mockNext);
    expect(statusSent).toBe(401);
    expect(errorJson.success).toBe(false);
  });

  it('should block CUSTOMER role from accessing ADMIN restricted endpoints', () => {
    const mockReq = {
      user: {
        id: 'cust-123',
        email: 'cinematographer@domain.com',
        fullName: 'Filmmaker',
        role: 'CUSTOMER',
      },
    } as AuthenticatedRequest;

    let statusSent = 0;
    let errorJson: any = null;

    const mockRes: any = {
      status: (code: number) => {
        statusSent = code;
        return {
          json: (data: any) => {
            errorJson = data;
          },
        };
      },
    };
    const mockNext = () => {};

    requireAdmin(mockReq, mockRes, mockNext);
    expect(statusSent).toBe(403);
    expect(errorJson.error).toContain('Admin');
  });

  it('should permit SUPER_ADMIN and ADMIN roles through RBAC guards', () => {
    const mockReq = {
      user: {
        id: 'admin-123',
        email: 'admin@flexgear.com',
        fullName: 'FlexGear Operations',
        role: 'ADMIN',
      },
    } as AuthenticatedRequest;

    let nextCalled = false;
    const mockRes: any = {};
    const mockNext = () => {
      nextCalled = true;
    };

    requireAdmin(mockReq, mockRes, mockNext);
    expect(nextCalled).toBe(true);
  });

  it('should enforce specific departmental role requirements (e.g. FINANCE)', () => {
    const financeGuard = requireRole('FINANCE', 'SUPER_ADMIN');
    
    const staffReq = {
      user: { id: 's1', email: 'staff@flexgear.com', fullName: 'Staff', role: 'STAFF' },
    } as AuthenticatedRequest;

    let statusSent = 0;
    const mockRes: any = {
      status: (code: number) => {
        statusSent = code;
        return { json: () => {} };
      },
    };

    financeGuard(staffReq, mockRes, () => {});
    expect(statusSent).toBe(403);
  });
});
