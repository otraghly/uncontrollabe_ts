import * as React from 'react'
import uncontrollable from 'uncontrollable'

/**
 * Jenya Tra
 * https://github.com/otraghly/uncontrollabe_ts
 * Licence 1: WTFPL
 * Licence 2: MIT
 */

/**
 * 
 */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * Support transparent ref forwarding.
 */
interface Ref<T> {
    ref?: React.RefObject<React.ComponentType<T>>
}

/**
 * Collects prop types for uncontrollable props
 */
type CP<H extends { [ key: string ]: string }, P extends any> = {
    [ K in keyof H | H[ keyof H ] ]: P[ K ]
}


/**
 * This type can be used to get type of resulting Uncontrollable Component's props.
 * Type parameters: 
 *    1) Type of uncontrollable hash
 *    2) Type of props
 * 
 * Use case:
 * Imagine an UncontrollableComponent, which should be extended 
 * to grab props from context. In this case, we'll need to provide prop types.
 * 
 * It could be done like this:
 * 
 * // This is out UncontrollableComponent
 * // See docs for {@link Uncontrollable} for details how it's done.
 * const UncontrollableEmitBar = Uncontrollable({
 *   identity: 'on_identity_change' as 'on_identity_change', // Whatever you have here, just make sure value typed as literal.
 * })(EmitBar)
 * 
 * // Next goes the trick: we getting the props type for UncontrollableEmitBar separately:
 * // (Type args just like for {@link Uncontrollable})
 * type UncontrollableEmitBarProps = UncontrollablePropsType<typeof uncontrollable_hash, Props>
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
export type UncontrollablePropsType<
    H extends { [ key: string ]: string },
    P extends any,
    > = Partial<CP<H, P>> & Omit<P, keyof CP<H, P>> & Ref<P>

/**
 * Usage:
 * 
 * // The Props interface should specify all props of the component,
 * // AND default*-like props for uncontrollable.
 * //
 * // Note that on_change- like handlers is mandatory, value- and default*- are optional.
 * interface Props {
 * // First props set
 *     value?: number // Optional
 *     on_change: (value?: number) => void // Mandatory, as uncontrollable guarantees presence (or TS will force you to ckeck before use.)
 * 
 *     defaultValue?: number // Though extendable component will not see it. 
 *
 *     // Second set
 *     title?: string
 *     on_title_change: (t?: string) => void
 *  *     defaultTitle?: string
 *
 *
 *     // Other props, whatever you have.
 *     other: boolean
 *     another?: string
 * }
 *
 *
 * class Example extends React.Component<Props> {
 *     public render () { return null }
 * }
 *
 *
 * // It's crucial to pass values typed as string literals, otherwise it won't work!
 * const UncontrolledExample = Uncontrollable({
 *     value: 'on_change' as 'on_change', // As literal!
 *     title: 'on_title_change' as 'on_title_change', // As literal!
 * })(Example)
 * 
 */
const Uncontrollable =
    <H extends { [ key: string ]: string }> (propHandlerHash: H, methods = []) =>
        <P extends object> (Component: React.ComponentType<P>):
            React.ComponentType<UncontrollablePropsType<H, P>> =>
            uncontrollable(Component, propHandlerHash, methods)


export default Uncontrollable          
