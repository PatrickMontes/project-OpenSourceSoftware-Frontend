import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SemanaService } from './semana';

describe('SemanaService', () => {
  let service: SemanaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SemanaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
