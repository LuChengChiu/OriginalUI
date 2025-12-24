/**
 * Optimized style mappings (extracted for performance)
 * Prevents object recreation on every render
 */
const TYPOGRAPHY_STYLES = {
  size: {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  },
  weight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
  },
  color: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-400",
    accent: "text-purple-600",
  },
  align: {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  },
};

/**
 * Base heading component with Days One font
 * Renders semantic heading elements with consistent typography
 *
 * @param {Object} props - Component props
 * @param {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} [props.as='h1'] - HTML heading element
 * @param {'heading'|'subheading'} [props.variant='heading'] - Visual hierarchy level
 * @param {'primary'|'secondary'|'muted'|'accent'} [props.color='primary'] - Semantic color token
 * @param {'left'|'center'|'right'} [props.align='left'] - Text alignment
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {any} props.children - Content to render
 */
const Heading = (props) => {
  const {
    as = "h1",
    variant = "heading",
    color = "primary",
    align = "left",
    className = "",
    children,
    ...rest
  } = props;
  const Component = as;

  // Simplified variant system
  const variantStyles = {
    heading: "text-lg font-semibold",
    subheading: "text-base font-medium",
  };

  return (
    <Component
      className={`
        font-days-one
        ${variantStyles[variant]}
        ${TYPOGRAPHY_STYLES.color[color]}
        ${TYPOGRAPHY_STYLES.align[align]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </Component>
  );
};

/**
 * Pre-configured heading components for common use cases
 */

/** Large primary heading (H1) */
const H1 = (props) => <Heading as="h1" variant="heading" {...props} />;

/** Medium primary heading (H2) */
const H2 = (props) => <Heading as="h2" variant="heading" {...props} />;

/** Small secondary heading (H3) */
const H3 = (props) => <Heading as="h3" variant="subheading" {...props} />;

/** Extra small secondary heading (H4) */
const H4 = (props) => <Heading as="h4" variant="subheading" {...props} />;

/**
 * Text component for body text with Barlow font
 * Handles all non-heading text content with semantic variants
 *
 * @param {Object} props - Component props
 * @param {'p'|'span'|'div'} [props.as='p'] - HTML text element
 * @param {'body'|'caption'} [props.variant='body'] - Text size and weight variant
 * @param {'primary'|'secondary'|'muted'|'accent'} [props.color='secondary'] - Semantic color token
 * @param {'left'|'center'|'right'} [props.align='left'] - Text alignment
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {any} props.children - Content to render
 */
const Text = (props) => {
  const {
    as = "p",
    variant = "body",
    color = "secondary",
    align = "left",
    className = "",
    children,
    ...rest
  } = props;
  const Component = as;

  // Simplified variant system
  const variantStyles = {
    body: "text-sm font-normal",
    caption: "text-xs font-normal",
  };

  return (
    <Component
      className={`
        font-barlow
        ${variantStyles[variant]}
        ${TYPOGRAPHY_STYLES.color[color]}
        ${TYPOGRAPHY_STYLES.align[align]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </Component>
  );
};

/**
 * Label component for form labels with Barlow font
 * Specialized component for form field labels with required indicator
 *
 * @param {Object} props - Component props
 * @param {'primary'|'secondary'|'muted'|'accent'} [props.color='primary'] - Semantic color token
 * @param {boolean} [props.required=false] - Shows required asterisk indicator
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {any} props.children - Label text content
 */
const Label = (props) => {
  const {
    color = "primary",
    required = false,
    className = "",
    children,
    ...rest
  } = props;
  return (
    <label
      className={`
        block font-barlow text-sm font-medium
        ${TYPOGRAPHY_STYLES.color[color]}
        ${className}
      `}
      {...rest}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export { H1, H2, H3, H4, Heading, Label, Text };
