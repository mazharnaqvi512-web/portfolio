import { HttpErrorResponse } from '@angular/common/http';

import { describeContactError } from './contact-error.util';

describe('describeContactError', () => {
  it('shows server validation messages with the field prefix stripped', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { errors: ['name: Name is required', 'email: Must be a valid email address'] },
    });

    const message = describeContactError(error);

    expect(message).toContain('Name is required');
    expect(message).toContain('Must be a valid email address');
    expect(message).not.toContain('name:');
  });

  it('falls back to generic copy for a 400 with no usable details', () => {
    const error = new HttpErrorResponse({ status: 400, error: null });
    expect(describeContactError(error)).toContain('Something went wrong');
  });

  it('describes a network failure (status 0) as a connectivity problem', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(describeContactError(error)).toContain("Couldn't reach the server");
  });

  it('describes rate limiting in plain language, without the status code', () => {
    const message = describeContactError(new HttpErrorResponse({ status: 429 }));
    expect(message).toContain('wait a little while');
    expect(message).not.toContain('429');
  });

  it('never leaks the raw status code for other server errors', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const message = describeContactError(error);
    expect(message).toContain('Something went wrong');
    expect(message).not.toContain('500');
  });

  it('handles non-HTTP errors with generic copy', () => {
    expect(describeContactError(new Error('boom'))).toContain('Something went wrong');
  });
});
