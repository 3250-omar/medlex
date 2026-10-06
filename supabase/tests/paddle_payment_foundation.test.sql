-- Paddle checkout privilege regression tests.

begin;

select plan(17);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.confirm_direct_session_payment(uuid,text,text)',
    'EXECUTE'
  ),
  'authenticated cannot confirm direct-session payments'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.grant_private_session_package(uuid,text,text)',
    'EXECUTE'
  ),
  'authenticated cannot grant paid package entitlements'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.reconcile_payment_attempt(uuid,text,text,boolean,text,text)',
    'EXECUTE'
  ),
  'authenticated cannot reconcile payment attempts'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.expire_direct_session_hold(uuid)',
    'EXECUTE'
  ),
  'authenticated cannot run the privileged hold expiry workflow'
);

select ok(
  has_function_privilege(
    'service_role',
    'public.confirm_direct_session_payment(uuid,text,text)',
    'EXECUTE'
  ),
  'service role can confirm direct-session payments'
);

select ok(
  has_function_privilege(
    'service_role',
    'public.grant_private_session_package(uuid,text,text)',
    'EXECUTE'
  ),
  'service role can grant paid package entitlements'
);

select ok(
  has_function_privilege(
    'service_role',
    'public.reconcile_payment_attempt(uuid,text,text,boolean,text,text)',
    'EXECUTE'
  ),
  'service role can reconcile payment attempts'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.create_direct_session_hold(uuid,text,text,text)',
    'EXECUTE'
  ),
  'authenticated cannot bypass Paddle safeguards via the base hold RPC'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.create_paddle_direct_session_hold(uuid,text,text,text)',
    'EXECUTE'
  ),
  'authenticated can create a Paddle direct-session hold'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.create_paddle_package_payment_attempt(text,uuid,text,text)',
    'EXECUTE'
  ),
  'authenticated can create a Paddle package payment attempt'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.create_paddle_direct_session_hold(uuid,text,text,text)',
    'EXECUTE'
  ),
  'anonymous users cannot create Paddle direct-session holds'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.create_paddle_package_payment_attempt(text,uuid,text,text)',
    'EXECUTE'
  ),
  'anonymous users cannot create Paddle package payment attempts'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.create_direct_session_hold(uuid,text,text)',
    'EXECUTE'
  ),
  'authenticated cannot call the obsolete hold overload'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.redeem_private_session_credit(uuid,uuid,text)',
    'EXECUTE'
  ),
  'authenticated can redeem an entitlement they own'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.process_paddle_private_session_webhook(text,text,text,text,uuid,boolean,text)',
    'EXECUTE'
  ),
  'authenticated cannot process Paddle webhooks'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.process_paddle_private_session_webhook(text,text,text,text,uuid,boolean,text)',
    'EXECUTE'
  ),
  'anonymous users cannot process Paddle webhooks'
);

select ok(
  has_function_privilege(
    'service_role',
    'public.process_paddle_private_session_webhook(text,text,text,text,uuid,boolean,text)',
    'EXECUTE'
  ),
  'service role can process verified Paddle webhooks'
);

select * from finish();

rollback;