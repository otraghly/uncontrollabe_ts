import * as React from 'react'
import uncontrollable from 'uncontrollable'

/**
 * Jenya Tra <traxtb@ya.ru>
 * Licence 1: WTFPL
 * Licence 2: MIT
 */

/**
 * Support transparent ref forwarding.
 */
interface Ref<T> {
    ref?: React.RefObject<React.ComponentType<T>>
}

/**
 * This type can be used to get type of resulting Uncontrollable Component's props.
 * Type parameters: 
 *    2) Props of the Component
 *    3) Hash of default* for Uncontrollable
 * 
 * Use case:
 * Imagine an UncontrollableComponent, which should be extended 
 * to grab props from context. In this case, we'll need to provide prop types.
 * 
 * It could be done like this:
 * 
 * // This is out UncontrollableComponent
 * // See docs for {@link Uncontrollable} for details how it's done.
 * const UncontrollableEmitBar = Uncontrollable<Props, UncontrollableProps>({
 *   identity: 'on_identity_change', // Whatever you have here.
 * })(EmitBar)
 * 
 * // Next goes the trick: we getting the props type for UncontrollableEmitBar separately:
 * // (Type args just like for {@link Uncontrollable})
 * type UncontrollableEmitBarProps = UncontrollablePropsType<Props, UncontrollableProps>
 * 
 * 
 * // Now we using the props type we created, to wrap uncontrollable component into context consumer:
 * export default React.forwardRef<typeof UncontrollableEmitBar, UncontrollableEmitBarProps>( // forwardRef takes out props as second arg.
 *   (props, ref: React.RefObject<typeof EmitBar>) => ( // Note that for RefObject we using initial component, as the «uncontrollable» passes ref down to it.
 *       <IdentificationContext.Consumer>
 *           {
 *               // 'defaultIdentity' props goes before {...props}
 *               // to allow parent component to overwrite it if necessary.
 *               identity => (
 *                   <UncontrollableEmitBar
 *                       defaultIdentity={ identity }
 *                       { ...props }
 *                       ref={ ref } // Don't forget the ref!
 *                   />
 *               )
 *           }
 *       </IdentificationContext.Consumer>
 *   )
 * )
 * 
 */
export type UncontrollablePropsType<P extends object, UP extends object> = Partial<UP> & Pick<P, Exclude<keyof P, keyof UP>> & Ref<P>

/**
 * To provide enough information for typing,
 * the wrapper needs two type parameters.
 * 
 * First one is just the type of props of Component.
 * Props like 'value' and 'on_change' goes here, but NOT 'defaultValue'-like.
 *
 * Second type describes all props the uncontrollable works with.
 * All 'value', 'on_change', 'defaultValue' props should go there.
 * Here it called as «UncontrollableProps».
 * 
 * To prevent repetition, 'value' and 'on_change' -like props could be
 * combined in one interface (here it called «ControllableProps»).
 * 
 *
 * The usage example follows:
 * 
 * // Here goes all props to be controlled by uncontrollabe.
 * // Note that 'on_change'-like function is mandatory.
 * interface ControllableProps {
 *     value?: string
 *     on_change: (value: string) => void
 *     expanded?: boolean
 *     on_expanded_change: (expanded: boolean) => void
 * }
 * 
 * // Here goes component's props, note how it extends ControllableProps
 * interface Props extends ControllableProps {
 *     color: string
 *     other_props?: any
 *     ...other component props     
 * }
 * 
 * // Component with the props
 * class ControllableExample extends React.Component<Props> {
 *  ...
 * }
 * 
 * // Hash of default* props
 * // extended with ControllableProps
 * interface UncontrollableProps extends ControllableProps {
 *      defaultValue?: string
 *      defaultExpanded?: boolean
 * }
 * 
 * // There we exporting UncontrollableComponent.
 * export default Uncontrollable<Props, UncontrollableProps>({
 *      value: 'on_change',
 *      expanded: 'on_expanded_change',
 * })(ControllableExample)
 * 
 */
const Uncontrollable =
    <P extends object, UP extends object> (propHandlerHash: object, methods = []) =>
        (Component: React.ComponentType<P>):
            React.ComponentType<UncontrollablePropsType<P, UP>> =>
            uncontrollable(Component, propHandlerHash, methods)


export default Uncontrollable            