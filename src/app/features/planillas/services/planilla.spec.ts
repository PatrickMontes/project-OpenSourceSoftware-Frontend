import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlanillaService } from './planilla';

describe('PlanillaService', () => {
  let service: PlanillaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PlanillaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
