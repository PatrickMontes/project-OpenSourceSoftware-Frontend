import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TurnoService } from './turno';

describe('TurnoService', () => {
  let service: TurnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TurnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
