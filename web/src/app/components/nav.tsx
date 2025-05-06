
import {
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
  } from "flowbite-react";
  import {
    
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
  export function Nav() {
    return (
      <Navbar fluid rounded>
        <NavbarBrand href="https://flowbite-react.com">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Galaxy</span>
        </NavbarBrand>
        <div className="flex md:order-2">
        <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="#" active>
            Home
          </NavbarLink>
          <NavbarLink href="video-to-video">Video Convertor</NavbarLink>
          <NavbarLink href="history">User&apos;s History</NavbarLink>
        </NavbarCollapse>
      </Navbar>
    );
  }
  