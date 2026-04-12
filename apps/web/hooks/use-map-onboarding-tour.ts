'use client';

import { useCallback, useRef } from 'react';
import { driver, type Driver, type DriveStep, type Config } from 'driver.js';

const STORAGE_KEY = 'map_onboarding_completed_v1';

export function useMapOnboardingTour() {
  const driverRef = useRef<Driver | null>(null);

  const getDriverInstance = useCallback(() => {
    if (!driverRef.current) {
      const isMobile =
        typeof window !== 'undefined' && window.innerWidth < 1024;

      const affectedSelector = isMobile
        ? '[data-tour=topnav-affected-locations-mobile]'
        : '[data-tour=topnav-affected-locations-desktop]';
      const safetySelector = isMobile
        ? '[data-tour=topnav-safety-locations-mobile]'
        : '[data-tour=topnav-safety-locations-desktop]';

      // Utility to check if the report button exists in the DOM
      function reportButtonExists() {
        return (
          typeof window !== 'undefined' &&
          !!document.querySelector('[data-tour="report-flood-alert"]')
        );
      }

      // Custom type for driver.js steps supporting dialog and highlight steps
      type DriverStep = {
        element?: string;
        popover: {
          title: string;
          description: string;
          side: 'bottom' | 'left' | 'top' | 'center';
          align: 'center' | 'start' | 'end';
        };
      };

      // Build steps array dynamically based on report button presence
      const steps: DriverStep[] = [
        {
          element: undefined,
          popover: {
            title: 'Welcome to Floodwatch!',
            description:
              "Stay safe and informed during floods. Explore the map and features to get real-time updates and report incidents.<br /><br /><img src='/logo.svg' alt='Floodwatch Logo' style='width: 100%; max-width: 120px; display: block; margin: 0 auto 8px auto;' />",
            side: 'center',
            align: 'center',
          },
        },
        {
          element: '[data-tour=map-main]',
          popover: {
            title: 'Interactive flood map',
            description:
              'This map shows real-time reports of flooded and safe locations in your area.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tour=map-search-bar]',
          popover: {
            title: 'Search locations',
            description:
              'Use the search bar to quickly find affected or safety locations.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: affectedSelector,
          popover: {
            title: 'Affected locations list',
            description:
              'Open a list of all reported flooded areas to quickly browse and jump to a location.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: safetySelector,
          popover: {
            title: 'Safety locations list',
            description:
              'View nearby shelters and hospitals so you know where to go in an emergency.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tour=map-zoom-controls]',
          popover: {
            title: 'Zoom controls',
            description: 'Zoom in and out to see more details or a wider area.',
            side: 'left',
            align: 'center',
          },
        },
        {
          element: '[data-tour=map-geolocate]',
          popover: {
            title: 'Your location',
            description:
              'Center the map on your current location to see nearby reports.',
            side: 'left',
            align: 'center',
          },
        },
        {
          element: '[data-tour=map-legend]',
          popover: {
            title: 'Map legend',
            description:
              'See what each color and icon means for flood severity and safety locations.',
            side: 'left',
            align: 'center',
          },
        },
        {
          element: '[data-tour=map-filters]',
          popover: {
            title: 'Map filters',
            description:
              'Filter reports by severity and show only the safety locations you care about.',
            side: 'left',
            align: 'center',
          },
        },
        {
          element: '[data-tour=map-hotlines]',
          popover: {
            title: 'Emergency hotlines',
            description:
              'Access local disaster hotlines so you can quickly call or copy important numbers.',
            side: 'top',
            align: 'end',
          },
        },
      ];

      // Insert the report tutorial step at the right place
      if (reportButtonExists()) {
        steps.splice(steps.length - 1, 0, {
          element: '[data-tour=report-flood-alert]',
          popover: {
            title: 'Report a flood',
            description:
              'Click here to report a flood in your area. Your report helps keep the community safe and informed.',
            side: 'bottom' as const,
            align: 'center' as const,
          },
        });
      } else {
        steps.splice(steps.length - 1, 0, {
          element: undefined,
          popover: {
            title: 'Reporting floods',
            description:
              "Once you log in, you’ll see a Report button here. Use it to submit flood reports and help others stay safe.<br /><br /><img src='tutorial/Report.png' alt='Report example' style='width: 100%; max-width: 260px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);' />",
            side: 'center' as const,
            align: 'center' as const,
          },
        });
      }

      // Add the flood pin dialog step at the end
      steps.push({
        element: undefined,
        popover: {
          title: 'Flood report pins',
          description:
            "Each colored pin on the map represents a user flood report for that location. Tap a pin to open its details and see more information. <br /><br /><img src='/tutorial/Flood%20Report%20Pins.png' alt='Flood Report Pins' style='width: 100%; max-width: 260px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);' />",
          side: 'center' as const,
          align: 'center' as const,
        },
      });
      steps.push({
        element: undefined,
        popover: {
          title: 'Safety pins',
          description:
            "Safety pins indicate verified safety locations like evacuation centers or emergency shelters. <br /><br /><img src='/tutorial/Safety%20Pins.png' alt='Safety Pins' style='width: 100%; max-width: 260px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);' />",
          side: 'center' as const,
          align: 'center' as const,
        },
      });
      steps.push({
        element: undefined,
        popover: {
          title: 'Verified vs Unverified reports',
          description:
            "Verified reports are those that have been confirmed by authorities, while unverified reports are submitted by users and may not yet be confirmed. <br /><br /><img src='/tutorial/Verified%20vs%20Unverified.png' alt='Verified vs Unverified' style='width: 100%; max-width: 260px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);' />",
          side: 'center' as const,
          align: 'center' as const,
        },
      });
      steps.push({
        element: undefined,
        popover: {
          title: 'Community Updates',
          description:
            "Stay informed about the latest flood updates and community news. <br /><br /><img src='/tutorial/community.png' alt='Community Updates' style='width: 100%; max-width: 260px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);' />",
          side: 'center' as const,
          align: 'center' as const,
        },
      });
      steps.push({
        element: undefined,
        popover: {
          title: 'Help your Community',
          description:
            "Help your community verify the flood report by confirming or disputing it. It makes a difference! <br /><br /><img src='/tutorial/credibility.png' alt='Verified vs Unverified' style='width: 100%; max-width: 260px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);' />",
          side: 'center' as const,
          align: 'center' as const,
        },
      });
      steps.push({
        element: undefined,
        popover: {
          title: 'See Directions',
          description:
            "Get directions to the nearest evacuation center or emergency shelter. <br /><br /><image src='/tutorial/Directions.png' autoplay muted loop playsinline style='width: 100%; max-width: 260px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); display: block; margin: 0 auto 8px auto;'></image>",
          side: 'center' as const,
          align: 'center' as const,
        },
      });
      steps.push({
        element: undefined,
        popover: {
          title: 'THANKYOU, PLEASE STAY SAFE!',
          description:
            "Thank you for using our app! Please stay safe and informed. <br /><br /><img src='/tutorial/thankyou.png' alt='Directions' style='width: 100%; max-width: 260px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);' />",
          side: 'center' as const,
          align: 'center' as const,
        },
      });

      const config: Config = {
        showProgress: true,
        allowClose: true,
        overlayOpacity: 0.6,
        animate: true,
        steps: steps as DriveStep[],
        onDestroyed: () => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, 'true');
          }
        },
      };

      driverRef.current = driver(config);
    }

    return driverRef.current;
  }, []);

  // Wait for a selector to appear in the DOM
  function waitForSelector(selector: string, timeout = 3000): Promise<void> {
    return new Promise((resolve) => {
      const start = Date.now();
      function check() {
        if (document.querySelector(selector)) return resolve();
        if (Date.now() - start > timeout) return resolve();
        requestAnimationFrame(check);
      }
      check();
    });
  }

  const startOnboardingTour = useCallback(async () => {
    if (typeof window === 'undefined') return;
    // If the report button is expected, wait for it
    if (!!document.querySelector('[data-tour="report-flood-alert"]')) {
      await waitForSelector('[data-tour="report-flood-alert"]');
    }
    const instance = getDriverInstance();
    instance.drive();
  }, [getDriverInstance]);

  const maybeStartOnboardingTourForNewUser = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const hasCompleted = window.localStorage.getItem(STORAGE_KEY) === 'true';
    if (hasCompleted) return;

    // If the report button is expected, wait for it
    if (!!document.querySelector('[data-tour="report-flood-alert"]')) {
      await waitForSelector('[data-tour="report-flood-alert"]');
    }
    const instance = getDriverInstance();
    instance.drive();
  }, [getDriverInstance]);

  const forceStartOnboardingTour = useCallback(async () => {
    if (typeof window === 'undefined') return;
    // If the report button is expected, wait for it
    if (!!document.querySelector('[data-tour="report-flood-alert"]')) {
      await waitForSelector('[data-tour="report-flood-alert"]');
    }
    const instance = getDriverInstance();
    instance.drive();
  }, [getDriverInstance]);

  return {
    startOnboardingTour,
    maybeStartOnboardingTourForNewUser,
    forceStartOnboardingTour,
  };
}
