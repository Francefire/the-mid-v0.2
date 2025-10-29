import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export function SignupForm({ className, ...props }) {
  const { register, user } = useAuth();
  const submitSignup = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userInfos = Object.fromEntries(formData);

    register(userInfos);
  };
  return user ? (
    <Navigate to="/" />
  ) : (
    <form
      onSubmit={submitSignup}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="birthDate">Birth Date</FieldLabel>
          <Input id="birthDate" name="birthDate" type="date" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="gender">Gender</FieldLabel>
          <Input
            id="gender"
            name="gender"
            type="text"
            placeholder="Male, Female, Other"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profilePictureUrl">
            Profile Picture URL
          </FieldLabel>
          <Input
            id="profilePictureUrl"
            name="profilePictureUrl"
            type="url"
            placeholder="https://example.com/profile.jpg"
          />
          <FieldDescription>
            Optional: URL to your profile picture
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Input
            id="bio"
            name="bio"
            type="text"
            placeholder="Tell us about yourself..."
          />
          <FieldDescription>
            Optional: A brief description about yourself
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link to="/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
