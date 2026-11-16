/** Synchronous lock closes the gap before React renders a pending state. */
export function createSubmissionGuard() {
  let busy = false;
  return {
    pending: () => busy,
    begin: () => {
      if (busy) return false;
      busy = true;
      return true;
    },
    end: () => { busy = false; },
  };
}