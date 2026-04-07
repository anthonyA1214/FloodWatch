import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useMe } from '@/hooks/use-me';
import { setPassword } from '@/lib/actions/password-actions';
import { ActionState } from '@/lib/types/action-state';
import { useActionState, useEffect, useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function SetPasswordForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { mutateMe } = useMe();

  const initialState: ActionState = {
    status: null,
    errors: null,
  };

  const [state, formAction, isPending] = useActionState(
    setPassword,
    initialState,
  );

  const [clearedFields, setClearedFields] = useState<Record<string, boolean>>(
    {},
  );

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function handleSuccess() {
      if (state.status === 'success') {
        // Close the panel after successful password change
        await mutateMe();
        onSuccess();
      }
    }

    handleSuccess();
  }, [state, onSuccess, mutateMe]);

  return (
    <form
      action={async (formData: FormData) => {
        setClearedFields({});
        return formAction(formData);
      }}
      className='space-y-6 text-sm'
    >
      {/* include resetSessionId as hidden input */}
      <div
        className='space-y-2'
        data-invalid={
          !!state.errors?.new_password && !clearedFields.new_password
        }
      >
        <Label htmlFor='new_password'>New Password</Label>
        <InputGroup className='rounded-full'>
          <InputGroupInput
            id='new_password'
            name='new_password'
            type={showNewPassword ? 'text' : 'password'}
            placeholder='Enter your new password'
            className='rounded-full'
            aria-invalid={
              !!state.errors?.new_password && !clearedFields.new_password
            }
            onChange={(e) =>
              setClearedFields((prev) => ({ ...prev, new_password: true }))
            }
          />
          <InputGroupAddon align='inline-end'>
            <InputGroupButton
              className='bg-transparent! hover:bg-transparent!'
              type='button'
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? (
                <IconEyeOff className='size-[1.5em]! shrink-0' />
              ) : (
                <IconEye className='size-[1.5em]! shrink-0' />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {state.errors?.new_password && !clearedFields.new_password && (
          <p className='text-red-500'>{state.errors.new_password}</p>
        )}
      </div>

      <div
        className='space-y-2'
        data-invalid={
          !!state.errors?.confirm_new_password &&
          !clearedFields.confirm_new_password
        }
      >
        <Label htmlFor='confirm_new_password'>Confirm Password</Label>
        <InputGroup className='rounded-full'>
          <InputGroupInput
            id='confirm_new_password'
            name='confirm_new_password'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Enter your confirm password'
            className='rounded-full'
            aria-invalid={
              !!state.errors?.confirm_new_password &&
              !clearedFields.confirm_new_password
            }
            onChange={(e) =>
              setClearedFields((prev) => ({
                ...prev,
                confirm_new_password: true,
              }))
            }
          />
          <InputGroupAddon align='inline-end'>
            <InputGroupButton
              className='bg-transparent! hover:bg-transparent!'
              type='button'
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <IconEyeOff className='size-[1.5em]! shrink-0' />
              ) : (
                <IconEye className='size-[1.5em]! shrink-0' />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {state.errors?.confirm_new_password &&
          !clearedFields.confirm_new_password && (
            <p className='text-red-500'>{state.errors.confirm_new_password}</p>
          )}
        {state?.errors && '_form' in state.errors && state.errors._form && (
          <p className='text-red-500 text-sm'>{state.errors._form}</p>
        )}
      </div>

      <Button
        disabled={isPending}
        type='submit'
        className='w-full rounded-full'
      >
        {isPending ? (
          <>
            Setting password... <Spinner />
          </>
        ) : (
          'Set Password'
        )}
      </Button>
    </form>
  );
}
