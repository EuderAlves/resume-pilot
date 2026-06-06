import { TestBed } from '@angular/core/testing';

import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SupabaseService,
          useValue: {
            isConfigured: () => false,
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should create a mock session when Supabase is not configured', async () => {
    const result = await service.signInWithPassword({
      email: 'teste@resumepilot.com',
      password: '123456',
    });

    expect(result.ok).toBeTrue();
    expect(result.mode).toBe('mock');
    expect(service.currentUser()?.email).toBe('teste@resumepilot.com');
  });
});
