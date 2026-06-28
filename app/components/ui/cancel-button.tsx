"use client";

import { Button } from "./button";

export function CancelButton() {
  return (
    <Button variant="outline" type="button" onClick={() => window.history.back()}>
      Cancel
    </Button>
  );
}
