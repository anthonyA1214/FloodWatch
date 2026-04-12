import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMe } from '@/hooks/use-me';
import { updateProfile } from '@/lib/actions/update-profile-action';
import { ActionState } from '@/lib/types/action-state';
import { useActionState, useEffect, useState } from 'react';
import { Empty, EmptyContent, EmptyMedia } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

export default function ProfileInformationForm({
  isEditing,
  setIsEditing,
  setIsSubmitting,
}: {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
}) {
  const { me, isLoading, isValidating, mutateMe } = useMe();

  const initialState: ActionState = {
    errors: null,
    status: null,
  };

  const [state, onUpdate, isUpdating] = useActionState(
    updateProfile,
    initialState,
  );

  const [clearedFields, setClearedFields] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    setIsSubmitting(isUpdating);
    async function handleSuccess() {
      if (state.status === 'success') {
        await mutateMe();
        setIsEditing(false);
      }
    }
    handleSuccess();
  }, [state, setIsEditing, isUpdating, setIsSubmitting, mutateMe]);

  if (isLoading || isValidating) {
    return (
      <Empty>
        <EmptyContent>
          <EmptyMedia>
            <Spinner className='size-16 text-[#0066CC]' />
          </EmptyMedia>
        </EmptyContent>
      </Empty>
    );
  }

  const firstNameError =
    state?.errors && 'firstName' in state.errors
      ? state.errors.firstName
      : null;
  const lastNameError =
    state?.errors && 'lastName' in state.errors ? state.errors.lastName : null;
  const emailError =
    state?.errors && 'email' in state.errors ? state.errors.email : null;
  const homeAddressError =
    state?.errors && 'homeAddress' in state.errors
      ? state.errors.homeAddress
      : null;

  const hasFirstNameError = !!firstNameError && !clearedFields['first_name'];
  const hasLastNameError = !!lastNameError && !clearedFields['last_name'];
  const hasEmailError = !!emailError;
  const hasHomeAddressError =
    !!homeAddressError && !clearedFields['home_address'];

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setClearedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleUpdate = async (formData: FormData) => {
    setClearedFields({});
    return onUpdate(formData);
  };

  return (
    <form
      id='profile-information-form'
      action={handleUpdate}
      className='flex flex-col gap-6 text-sm'
    >
      {/* first name */}
      <div className='space-y-2' data-invalid={hasFirstNameError}>
        <Label htmlFor='first_name'>First Name</Label>
        <Input
          id='first_name'
          name='first_name'
          type='text'
          defaultValue={me?.firstName}
          placeholder='Enter your first name'
          className='rounded-full px-4 shadow-sm'
          aria-invalid={hasFirstNameError}
          onChange={handleFieldChange}
          disabled={!isEditing}
        />
        {hasFirstNameError && (
          <p className='text-red-500 text-sm'>{firstNameError}</p>
        )}
      </div>

      {/* last name */}
      <div className='space-y-2' data-invalid={hasLastNameError}>
        <Label htmlFor='last_name'>Last Name</Label>
        <Input
          id='last_name'
          name='last_name'
          type='text'
          defaultValue={me?.lastName}
          placeholder='Enter your last name'
          className='rounded-full px-4 shadow-sm'
          aria-invalid={hasLastNameError}
          onChange={handleFieldChange}
          disabled={!isEditing}
        />
        {hasLastNameError && (
          <p className='text-red-500 text-sm'>{lastNameError}</p>
        )}
      </div>

      <div className='space-y-2' data-invalid={hasEmailError}>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          defaultValue={me?.email}
          placeholder='Enter your email'
          className='rounded-full px-4 shadow-sm'
          aria-invalid={hasEmailError}
          disabled
        />
        {hasEmailError && <p className='text-red-500 text-sm'>{emailError}</p>}
      </div>

      <div className='space-y-2' data-invalid={hasHomeAddressError}>
        <Label htmlFor='home_address'>Home Address</Label>
        <Input
          id='home_address'
          name='home_address'
          type='text'
          defaultValue={me?.homeAddress}
          placeholder='Enter your home address'
          className='rounded-full px-4 shadow-sm'
          aria-invalid={hasHomeAddressError}
          onChange={handleFieldChange}
          disabled={!isEditing}
        />
        {hasHomeAddressError && (
          <p className='text-red-500 text-sm'>{homeAddressError}</p>
        )}

        {state?.errors && '_form' in state.errors && state.errors._form && (
          <p className='text-red-500 text-sm'>{state.errors._form}</p>
        )}
      </div>
    </form>
  );
}
