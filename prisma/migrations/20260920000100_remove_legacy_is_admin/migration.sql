-- User.role has been the sole global authority since IMP-009. This migration
-- refuses to discard contradictory legacy evidence automatically.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "User"
    WHERE (role = 'ADMIN' AND "isAdmin" = false)
       OR (role <> 'ADMIN' AND "isAdmin" = true)
  ) THEN
    RAISE EXCEPTION 'IMP-009 removal preflight: contradictory role/isAdmin records require explicit correction'
      USING ERRCODE = '23514';
  END IF;
END;
$$;

ALTER TABLE "User" DROP COLUMN "isAdmin";
