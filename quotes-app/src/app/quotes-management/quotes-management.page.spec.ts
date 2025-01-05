import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotesManagementPage } from './quotes-management.page';

describe('QuotesManagementPage', () => {
  let component: QuotesManagementPage;
  let fixture: ComponentFixture<QuotesManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
